import ChatChannelSidebar from "@components/chat/ChatChannelSidebar";
import MessageArea from "@components/chat/MessageArea";
import { ChatProvider } from "../Context/ChatProvider";

const ChatLayout = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-50">
        <ChatChannelSidebar />
        <MessageArea />
      </div>
    </ChatProvider>
  );
};
export default ChatLayout;
