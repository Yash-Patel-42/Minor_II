import { useState } from "react";
import { FaHashtag, FaUser } from "react-icons/fa";
import { useParams } from "react-router";
import { useChat } from "../../context/ChatProvider";
import AddChannelButton from "./AddChannelButton";
import ChannelTypeModal from "./ChannelTypeModal";
import MemberSelector from "./MemberSelector";

const ChatChannelSidebar = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const {
    chatChannel,
    activeChatChannel,
    setActiveChatChannel,
    createChatChannel,
  } = useChat();

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [channelMode, setChannelMode] = useState<"dm" | "group">("dm");

  const general = chatChannel.find((ch) => ch.channelType === "general");
  const groups = chatChannel.filter((ch) => ch.channelType === "custom_group");
  const dms = chatChannel.filter((ch) => ch.channelType === "direct_message");

  const workspaceMemberCount = general?.members?.length || 0;

  const handleAddChannel = () => {
    setShowTypeModal(true);
  };

  const handleSelectDM = () => {
    setChannelMode("dm");
    setShowTypeModal(false);
    setShowMemberSelector(true);
  };

  const handleSelectGroup = () => {
    setChannelMode("group");
    setShowTypeModal(false);
    setShowMemberSelector(true);
  };

  const handleCreateChannel = async (
    memberIds: string[],
    channelName?: string
  ) => {
    if (channelMode === "dm") {
      await createChatChannel("Direct Message", memberIds, "direct_message");
    } else {
      await createChatChannel(
        channelName || "New Group",
        memberIds,
        "custom_group"
      );
    }
  };

  return (
    <div className="flex w-64 flex-col overflow-y-auto bg-gray-800 p-4 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Chat</h2>
        <AddChannelButton onClick={handleAddChannel} />
      </div>

      {general && (
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Workspace
          </h3>
          <button
            onClick={() => setActiveChatChannel(general)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-all ${
              activeChatChannel?._id === general._id
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            <FaHashtag className="h-4 w-4" />
            <span className="font-medium">{general.name}</span>
          </button>
        </div>
      )}

      {groups.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Groups
          </h3>
          <div className="space-y-1">
            {groups.map((channel) => (
              <button
                key={channel._id}
                onClick={() => setActiveChatChannel(channel)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-all ${
                  activeChatChannel?._id === channel._id
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <FaHashtag className="h-4 w-4" />
                <span className="truncate font-medium">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {dms.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-400">
            Direct Messages
          </h3>
          <div className="space-y-1">
            {dms.map((channel) => (
              <button
                key={channel._id}
                onClick={() => setActiveChatChannel(channel)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-all ${
                  activeChatChannel?._id === channel._id
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <FaUser className="h-4 w-4" />
                <span className="truncate font-medium">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ChannelTypeModal
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onSelectDM={handleSelectDM}
        onSelectGroup={handleSelectGroup}
        workspaceMemberCount={workspaceMemberCount}
      />

      <MemberSelector
        isOpen={showMemberSelector}
        onClose={() => setShowMemberSelector(false)}
        workspaceId={workspaceId || ""}
        mode={channelMode}
        onCreateChannel={handleCreateChannel}
      />
    </div>
  );
};

export default ChatChannelSidebar;
