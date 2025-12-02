import api from "@utils/axiosInstance";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router";
import type { IChatChannel, IChatMessage } from "../types/ChatTypes";
import { useSocket } from "./SocketProvider";

interface ChatContextType {
  chatChannel: IChatChannel[];
  activeChatChannel: IChatChannel | null;
  chatMessages: IChatMessage[];
  loading: boolean;
  setActiveChatChannel: (channel: IChatChannel) => void;
  sendMessage: (content: string) => Promise<void>;
  createChatChannel: (
    name: string,
    memberIds: string[],
    type: string
  ) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { workspaceId } = useParams();
  const { socket } = useSocket();

  const [chatChannel, setChatChannel] = useState<IChatChannel[]>([]);
  const [activeChatChannel, setActiveChatChannel] =
    useState<IChatChannel | null>(null);
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  //Fetch Channels
  useEffect(() => {
    if (!workspaceId) return;

    const fetchChatChannels = async () => {
      try {
        const response = await api.get(
          `chat/workspace/${workspaceId}/chat-channels`
        );
        setChatChannel(response.data.channels);

        const generalChatChannel = response.data.channels.find(
          (channel: IChatChannel) => channel.channelType === "general"
        );
        if (generalChatChannel) setActiveChatChannel(generalChatChannel);
      } catch (error) {
        console.error("Error fetching chat channels:", error);
      }
    };
    fetchChatChannels();
    socket?.emit("join_workspace", workspaceId);
  }, [workspaceId, socket]);

  //Fetch Messages When Channel Changes
  useEffect(() => {
    if (!activeChatChannel || !workspaceId) return;

    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `chat/workspace/${workspaceId}/chat-channel/${activeChatChannel._id}/messages`
        );
        setChatMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatMessages();
    socket?.emit("join_channel", activeChatChannel._id);
    return () => {
      socket?.emit("leave_channel", activeChatChannel._id);
    };
  }, [activeChatChannel, workspaceId, socket]);

  //Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: IChatMessage) => {
      if (message.channelID === activeChatChannel?._id) {
        setChatMessages((prev) => [...prev, message]);
      }
    });
    socket.on("message_edited", (message: IChatMessage) => {
      setChatMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    });
    socket.on("message_deleted", ({ messageId }: { messageId: string }) => {
      setChatMessages((prev) => prev.filter((m) => m._id !== messageId));
    });
    return () => {
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
    };
  }, [socket, activeChatChannel]);

  //Send Message
  const sendMessage = async (content: string) => {
    if (!activeChatChannel || !workspaceId) return;
    try {
      await api.post(
        `chat/workspace/${workspaceId}/chat-channel/${activeChatChannel._id}/send-message`,
        { messageContent: content }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  //Create Channel
  const createChatChannel = async (
    name: string,
    memberIDs: string[],
    type: string
  ) => {
    if (!workspaceId) return;

    try {
      const res = await api.post(
        `chat/workspace/${workspaceId}/chat-channel/create`,
        {
          name,
          channelType: type,
          memberIDs,
        }
      );
      setChatChannel((prev) => [...prev, res.data.channel]);
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  };

  //Load More Messages
  const loadMoreMessages = async () => {
    if (!activeChatChannel || !workspaceId || chatMessages.length === 0) return;

    try {
      const oldestMessage = chatMessages[0];
      const res = await api.get(
        `/workspace/${workspaceId}/chat/channels/${activeChatChannel._id}/messages?before=${oldestMessage._id}`
      );
      setChatMessages((prev) => [...res.data.messages, ...prev]);
    } catch (err) {
      console.error("Failed to load more:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatChannel,
        activeChatChannel,
        chatMessages,
        loading,
        setActiveChatChannel,
        sendMessage,
        createChatChannel,
        loadMoreMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
