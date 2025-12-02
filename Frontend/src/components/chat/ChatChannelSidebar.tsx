import type React from "react";
import { useChat } from "../../context/ChatProvider";

const ChatChannelSidebar: React.FC = () => {
  const { chatChannel, activeChatChannel, setActiveChatChannel } = useChat();

  const general = chatChannel.find((ch) => ch.channelType === "general");
  const groups = chatChannel.filter((ch) => ch.channelType === "custom_group");
  const dms = chatChannel.filter((ch) => ch.channelType === "direct_message");

  return (
    <div className="w-64 overflow-y-auto bg-gray-800 p-4 text-white">
      <h2 className="mb-4 text-xl font-bold">Chat</h2>

      {general && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold text-gray-400">
            WORKSPACE
          </h3>
          <button
            onClick={() => setActiveChatChannel(general)}
            className={`w-full rounded px-3 py-2 text-left transition ${
              activeChatChannel?._id === general._id
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            # {general.name}
          </button>
        </div>
      )}

      {groups.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold text-gray-400">GROUPS</h3>
          {groups.map((channel) => (
            <button
              key={channel._id}
              onClick={() => setActiveChatChannel(channel)}
              className={`mb-1 w-full rounded px-3 py-2 text-left transition ${
                activeChatChannel?._id === channel._id
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              # {channel.name}
            </button>
          ))}
        </div>
      )}

      {dms.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold text-gray-400">
            DIRECT MESSAGES
          </h3>
          {dms.map((channel) => (
            <button
              key={channel._id}
              onClick={() => setActiveChatChannel(channel)}
              className={`mb-1 w-full rounded px-3 py-2 text-left transition ${
                activeChatChannel?._id === channel._id
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {channel.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatChannelSidebar;
