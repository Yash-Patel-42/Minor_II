import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { IWorkspace } from "../../types/WorkspaceType";
import api from "../../utils/axiosInstance";

function Workspace() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await api.get(`/workspace/${workspaceId}`, {
          withCredentials: true,
        });
        setWorkspace(response.data.workspace);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  const handleChannelAuth = () => {
    window.location.href = `http://localhost:3000/api/workspace/auth/google?workspaceId=${workspace?._id}`;
  };

  const addUserToWorkspace = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      await api.post(`/workspace/${workspaceId}/invite/user`, {
        newMemberEmail: email,
        newMemberRole: role,
      });
      toast.success(`Invite sent to ${email}!`, {
        duration: 4000,
        position: "bottom-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      });
      setEmail("");
      setRole("");
    } catch (error) {
      // Show error toast
      toast.error(`Failed to send invite. Please try again. ${error}}`, {
        duration: 4000,
        position: "bottom-right",
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      });
    }
  };

  if (!workspace) return <div>Loading</div>;
  return (
    <div className="min-h-screen bg-neutral-900 p-4 pt-8 text-gray-300 md:p-10">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="font-display flex items-baseline gap-3 text-5xl font-bold text-white">
          {workspace.workspaceName}
          <span className="font-sans text-lg text-gray-600">
            ({workspace._id})
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-gray-400">
          {workspace.workspaceDescription}
        </p>
      </div>
      {workspace.youtubeChannelID ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {/* --- Action Buttons --- */}
          <div className="mb-10 flex flex-wrap gap-4">
            <motion.button
              onClick={() => navigate(`/workspace/${workspaceId}/upload-video`)}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/40"
              whileHover={{
                scale: 1.05,
                rotate: -2,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Upload a Video
            </motion.button>
            <motion.button
              onClick={() =>
                navigate(`/workspace/${workspace._id}/upload-requests`)
              }
              className="rounded-lg bg-neutral-700 px-5 py-3 font-medium text-gray-300 ring-1 ring-neutral-600 transition-all hover:bg-neutral-600 hover:text-white"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Upload Requests
            </motion.button>
            <motion.button
              onClick={() =>
                navigate(`/workspace/${workspace._id}/permissions`)
              }
              className="rounded-lg bg-neutral-700 px-5 py-3 font-medium text-gray-300 ring-1 ring-neutral-600 transition-all hover:bg-neutral-600 hover:text-white"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Adjust Permissions
            </motion.button>

            <motion.button
              onClick={() => navigate(`/channel/info/${workspaceId}`)}
              className="rounded-lg bg-neutral-700 px-5 py-3 font-medium text-gray-300 ring-1 ring-neutral-600 transition-all hover:bg-neutral-600 hover:text-white"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Channel Info
            </motion.button>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {/* Owner Details Card */}
            <div className="rounded-2xl bg-neutral-800 p-6 shadow-xl ring-1 ring-white/10">
              <h3 className="font-display mb-3 border-b border-white/10 pb-2 text-2xl font-semibold text-white">
                Owner Details
              </h3>
              <p className="text-lg text-gray-300">{workspace.ownerID.name}</p>
              <p className="text-sm text-gray-500">{workspace.ownerID.email}</p>
            </div>
            {/* YouTube Channel Card */}
            <div className="rounded-2xl bg-neutral-800 p-6 shadow-xl ring-1 ring-white/10">
              <h3 className="font-display mb-3 border-b border-white/10 pb-2 text-2xl font-semibold text-green-400">
                Channel Connected
              </h3>
              <p className="text-lg text-gray-300">
                {workspace.youtubeChannelID.channelName}
              </p>
              <p className="text-sm text-gray-500">
                ID: {workspace.youtubeChannelID.channelID}
              </p>
              <p className="text-sm text-gray-500">
                {workspace.youtubeChannelID.channelEmail}
              </p>
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Member List */}
            <div className="lg:col-span-2">
              <h3 className="font-display mb-6 text-4xl font-semibold text-white">
                Workspace Members
              </h3>
              {workspace.members && workspace.members.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {workspace.members.map((member, idx) => (
                    <motion.div
                      key={idx}
                      className="rounded-xl bg-neutral-800 p-5 shadow-lg ring-1 ring-white/10"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <p className="text-lg font-medium text-white">
                        {member.userID?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {member.userID?.email}
                      </p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p>
                          <span className="font-semibold text-gray-400">
                            Role:
                          </span>
                          <span
                            className={`ml-2 font-bold capitalize ${
                              member.role === "admin"
                                ? "text-indigo-400"
                                : member.role === "manager"
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                            }`}
                          >
                            {member.role}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-400">
                            Status:
                          </span>
                          <span
                            className={`ml-2 font-medium capitalize ${
                              member.status === "active"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {member.status}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">No members added yet.</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-10 rounded-2xl bg-neutral-800 p-6 shadow-xl ring-1 ring-white/10">
                <h3 className="font-display mb-4 text-2xl font-semibold text-white">
                  Add Member
                </h3>
                <form
                  onSubmit={addUserToWorkspace}
                  className="flex flex-col gap-4 text-gray-300"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-indigo-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teammate@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-400">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="w-full rounded-md border-0 bg-neutral-700 p-3 text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <motion.button
                    type="submit"
                    className="mt-2 w-full rounded-lg bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-500/40"
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    Send Invite
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="mt-16 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-yellow-500/50 bg-neutral-800/30 p-10 py-20 text-center"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <h2 className="font-display text-4xl font-bold text-white">
            Connect Your Channel to Continue
          </h2>
          <p className="mt-2 max-w-lg text-lg text-gray-400">
            To manage members, upload videos, and use this workspace, you must
            first authenticate your YouTube channel.
          </p>
          <motion.button
            onClick={handleChannelAuth}
            className="mt-8 rounded-lg bg-yellow-500 px-8 py-4 font-bold text-neutral-900 shadow-xl shadow-yellow-500/30"
            whileHover={{
              scale: 1.1,
              rotate: 2,
              boxShadow: "0 10px 20px rgba(234, 179, 8, 0.4)",
            }}
            whileTap={{
              scale: 0.9,
              rotate: 0,
            }}
          >
            Authenticate YouTube Channel
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default Workspace;
