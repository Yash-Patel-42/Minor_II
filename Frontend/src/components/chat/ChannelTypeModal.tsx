import { FaComment, FaTimes, FaUsers } from "react-icons/fa";

interface ChannelTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDM: () => void;
  onSelectGroup: () => void;
  workspaceMemberCount: number;
}

const ChannelTypeModal: React.FC<ChannelTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectDM,
  onSelectGroup,
  workspaceMemberCount,
}) => {
  if (!isOpen) return null;

  const canCreateGroup = workspaceMemberCount >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Create New Channel
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSelectDM}
            className="flex w-full items-start gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <FaComment className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-gray-900">
                Direct Message
              </h3>
              <p className="text-sm text-gray-600">
                Send a private message to a workspace member
              </p>
            </div>
          </button>

          <button
            onClick={onSelectGroup}
            disabled={!canCreateGroup}
            className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
              canCreateGroup
                ? "border-gray-200 hover:border-green-500 hover:bg-green-50"
                : "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                canCreateGroup ? "bg-green-100" : "bg-gray-200"
              }`}
            >
              <FaUsers
                className={`h-6 w-6 ${
                  canCreateGroup ? "text-green-600" : "text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`mb-1 font-semibold ${
                  canCreateGroup ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Create Group
              </h3>
              <p className="text-sm text-gray-600">
                {canCreateGroup
                  ? "Start a group chat with multiple members (min 3)"
                  : `Need at least 3 workspace members (currently ${workspaceMemberCount})`}
              </p>
            </div>
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          All channels are private to workspace members only
        </p>
      </div>
    </div>
  );
};

export default ChannelTypeModal;
