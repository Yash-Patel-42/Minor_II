import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../Context/AuthProvider";
import type { IWorkspace } from "../../types/WorkspaceType";
import api from "../../utils/axiosInstance";

const Permissions: React.FC = () => {
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { workspaceId } = useParams();
  const { user } = useAuth();

  // Fetch workspace details and permissions
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await api.get(`/workspace/${workspaceId}`, {
          withCredentials: true,
        });
        const workspaceData = response.data.workspace;
        setWorkspace(workspaceData);
        setMatrix(workspaceData.permissionMatrix || {});
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await api.put(
        `/workspace/${workspaceId}/update-permissions`,
        {
          permissionMatrix: matrix,
        },
        {
          withCredentials: true,
        }
      );
      setMessage("Permissions updated successfully");
      console.log("Updated:", response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update permissions");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Determine current user's role in workspace
  const currentUserRole = workspace?.members?.find(
    (member) => member?.userID?._id === user?._id
  )?.role;

  const globallyLockedPerms = ["transfer_ownership", "authorize_channel"];

  const currentUserPerms =
    currentUserRole && matrix[currentUserRole] ? matrix[currentUserRole] : {};
  const isOwner = currentUserRole === "owner";

  const canEditTargetRole = (targetRole: string) => {
    if (!currentUserRole) return false;
    if (currentUserRole === "viewer") return false;
    if (currentUserRole === "admin" && targetRole === "owner") return false;
    if (
      currentUserRole === "manager" &&
      (targetRole === "admin" || targetRole === "owner")
    )
      return false;
    if (currentUserRole === "editor" || currentUserRole === "viewer")
      return false;
    return true;
  };
  const isCheckboxDisabled = (
    targetRole: string,
    perm: string,
    currentValue: boolean
  ): boolean => {
    if (globallyLockedPerms.includes(perm)) return true;
    if (currentUserRole && targetRole === currentUserRole) return true;
    if (!canEditTargetRole(targetRole)) return true;
    if (!currentValue && !currentUserPerms[perm]) return true;
    if (currentValue && !currentUserPerms[perm] && !isOwner) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Adjust Workspace Permissions
        </h1>

        {Object.keys(matrix).length === 0 ? (
          <p className="text-center text-gray-400">Loading permissions...</p>
        ) : (
          Object.entries(matrix).map(([role, permissions]) => (
            <div
              key={role}
              className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4"
            >
              <h2 className="mb-3 text-xl font-semibold capitalize">
                {role} Permissions
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Object.entries(permissions || {}).map(([perm, value]) => {
                  const disabled = isCheckboxDisabled(role, perm, value);
                  return (
                    <label
                      key={perm}
                      className={`flex items-center space-x-2 rounded-md px-3 py-2 transition ${
                        disabled
                          ? "cursor-not-allowed bg-gray-700/60"
                          : "bg-gray-700/40 hover:bg-gray-700/70"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        disabled={disabled}
                        onChange={() => {
                          if (disabled) return;
                          setMatrix((prev) => ({
                            ...prev,
                            [role]: {
                              ...prev[role],
                              [perm]: !prev[role][perm],
                            },
                          }));
                        }}
                        className="h-4 w-4 accent-blue-500"
                      />
                      <span
                        className={`text-sm capitalize ${
                          disabled ? "cursor-not-allowed opacity-60" : ""
                        }`}
                      >
                        {perm.replaceAll("_", " ")}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div className="mt-8 flex flex-col items-center space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving || currentUserRole === "viewer"}
            className={`rounded-lg px-6 py-2 font-medium transition ${
              isSaving || currentUserRole === "viewer"
                ? "cursor-not-allowed bg-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          {message && <p className="text-sm text-gray-300">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Permissions;
