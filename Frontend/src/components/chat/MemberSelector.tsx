import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaSearch, FaTimes } from "react-icons/fa";
import api from "../../utils/axiosInstance";

interface Member {
  _id: string;
  userID: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface MemberSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  mode: "dm" | "group";
  onCreateChannel: (memberIds: string[], channelName?: string) => Promise<void>;
}

const MemberSelector: React.FC<MemberSelectorProps> = ({
  isOpen,
  onClose,
  workspaceId,
  mode,
  onCreateChannel,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch workspace members
  useEffect(() => {
    if (!isOpen || !workspaceId) return;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/workspace/${workspaceId}/members`);
        setMembers(res.data.members || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Failed to load workspace members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, workspaceId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedMembers(new Set());
      setGroupName("");
      setSearchQuery("");
    }
  }, [isOpen]);

  const toggleMember = (memberId: string) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      if (mode === "dm" && newSelection.size >= 1) {
        toast.error("Direct messages can only have one recipient");
        return;
      }
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const handleCreate = async () => {
    if (mode === "dm" && selectedMembers.size !== 1) {
      toast.error("Please select exactly one member for direct message");
      return;
    }

    if (mode === "group" && selectedMembers.size < 2) {
      toast.error("Please select at least 2 members (total 3 with you)");
      return;
    }

    if (mode === "group" && !groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setCreating(true);
    try {
      await onCreateChannel(
        Array.from(selectedMembers),
        mode === "group" ? groupName : undefined
      );
      toast.success(
        mode === "dm"
          ? "Direct message started!"
          : "Group created successfully!"
      );
      onClose();
    } catch (error) {
      console.error("Failed to create channel:", error);
      toast.error("Failed to create channel");
    } finally {
      setCreating(false);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.userID.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canCreate =
    mode === "dm"
      ? selectedMembers.size === 1
      : selectedMembers.size >= 2 && groupName.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex h-[600px] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "dm" ? "Select Member" : "Create Group"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {mode === "dm"
                ? "Choose someone to message"
                : `Select members (${selectedMembers.size} selected, min 2)`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {mode === "group" && (
          <div className="border-b p-4">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Design Team, Marketing"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              maxLength={50}
            />
          </div>
        )}

        <div className="border-b p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No members found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => {
                const isSelected = selectedMembers.has(member.userID._id);
                return (
                  <button
                    key={member._id}
                    onClick={() => toggleMember(member.userID._id)}
                    className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 font-semibold text-white">
                      {member.userID.name[0].toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {member.userID.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.userID.email}
                      </p>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <FaCheck className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={creating}
              className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate || creating}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : mode === "dm"
                  ? "Start Chat"
                  : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSelector;
