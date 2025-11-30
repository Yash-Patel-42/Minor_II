import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiInbox,
  FiLoader,
  FiX,
} from "react-icons/fi";
import type { IInbox } from "../../types/InboxType";
import api from "../../utils/axiosInstance";

function Inbox() {
  const [inbox, setInbox] = useState<IInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInbox = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api("/inbox/user/invite");
        setInbox(response.data.inbox);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch your inbox.");
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  const handleAcceptInvite = async (invite: IInbox) => {
    setProcessingId(invite._id);
    try {
      await api.post("/inbox/user/invite/accept", {
        invite,
      });
      setInbox((prev) =>
        prev.map((i) =>
          i._id === invite._id
            ? {
                ...i,
                response: "accepted",
              }
            : i
        )
      );
    } catch (error) {
      console.log(error);
      setError("Failed to accept invite.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- NEW: Updated handler to be state-aware ---
  const handleDeclineInvite = async (invite: IInbox) => {
    setProcessingId(invite._id);
    try {
      await api.post("/inbox/user/invite/decline", {
        invite,
      });
      // Update local state immediately
      setInbox((prev) =>
        prev.map((i) =>
          i._id === invite._id
            ? {
                ...i,
                response: "declined",
              }
            : i
        )
      );
    } catch (error) {
      console.log(error);
      setError("Failed to decline invite.");
    } finally {
      setProcessingId(null);
    }
  };

  // --- NEW: Loading State ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-10 text-gray-300">
        <FiLoader className="h-12 w-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-4 pt-8 text-gray-300 md:p-10">
      <h1 className="font-display mb-8 text-5xl font-bold text-white">
        Your Inbox
      </h1>

      {/* --- NEW: Error State --- */}
      {error && (
        <div className="mb-8 flex items-center gap-3 rounded-md bg-red-900/50 p-4 text-red-300 ring-1 ring-red-500/30">
          <FiAlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
        </div>
      )}

      {/* --- NEW: Empty State --- */}
      {!loading && inbox.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-4 border-dashed border-neutral-700 p-16 text-center">
          <FiInbox className="mb-4 h-16 w-16 text-neutral-600" />
          <span className="block text-2xl font-semibold text-white">
            Your inbox is empty
          </span>
          <p className="mt-2 text-gray-400">
            Workspace invitations will appear here.
          </p>
        </div>
      ) : (
        // --- List of Invites ---
        <div className="space-y-6">
          <AnimatePresence>
            {inbox.map((invite) => {
              const isProcessing = processingId === invite._id;

              return (
                <motion.div
                  key={invite._id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="overflow-hidden rounded-2xl bg-neutral-800 shadow-xl ring-1 ring-white/10"
                >
                  {/* --- Invite Details --- */}
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="space-y-2 p-6 md:col-span-2">
                      <h2 className="font-display text-3xl font-bold text-white">
                        {invite.payload.workspaceName}
                      </h2>
                      <p className="text-gray-400">
                        {invite.payload.workspaceDescription}
                      </p>
                      <p className="pt-2 text-sm text-gray-500">
                        Invited by:{" "}
                        <span className="font-medium text-gray-300">
                          {invite.sender.name} ({invite.sender.email})
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-center rounded-bl-2xl bg-neutral-900/50 p-6 md:rounded-r-2xl md:rounded-bl-none">
                      <div>
                        <p className="text-sm font-semibold uppercase text-indigo-400">
                          Your Requested Role
                        </p>
                        <p className="font-display text-4xl font-bold capitalize text-white">
                          {invite.payload.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* --- Action Buttons / Status --- */}
                  <div className="border-t border-white/10 bg-neutral-800/50 p-4">
                    {invite.type === "workspace-invite" &&
                    invite.response === "pending" ? (
                      <div className="flex flex-wrap gap-4">
                        <motion.button
                          onClick={() => handleAcceptInvite(invite)}
                          disabled={isProcessing}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-bold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                          whileHover={{
                            scale: isProcessing ? 1 : 1.03,
                          }}
                          whileTap={{
                            scale: isProcessing ? 1 : 0.98,
                          }}
                        >
                          {isProcessing ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <FiCheck />
                          )}
                          {isProcessing ? "Accepting..." : "Accept"}
                        </motion.button>

                        <motion.button
                          onClick={() => handleDeclineInvite(invite)}
                          disabled={isProcessing}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                          whileHover={{
                            scale: isProcessing ? 1 : 1.03,
                          }}
                          whileTap={{
                            scale: isProcessing ? 1 : 0.98,
                          }}
                        >
                          <FiX /> Decline
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-lg font-medium">
                        <span className="text-gray-400">Status:</span>
                        <span
                          className={`font-bold capitalize ${
                            invite.response === "accepted"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {invite.response}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Inbox;
