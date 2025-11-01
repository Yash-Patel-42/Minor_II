import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiGlobe,
  FiLoader,
  FiLock,
  FiRefreshCw,
  FiTag,
  FiX,
} from 'react-icons/fi';
import { useParams } from 'react-router';
import { useAuth } from '../../Context/AuthProvider';
import type { IApprovalRequest } from '../../types/ApprovalRequest';
import api from '../../utils/axiosInstance';
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    pending: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
    approved: 'bg-green-500/20 text-green-300 ring-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 ring-red-500/30',
    need_edits: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
    default: 'bg-neutral-500/20 text-neutral-300 ring-neutral-500/30',
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${config}`}>
      {status.replace('_', ' ')}
    </span>
  );
};
const PrivacyIcon: React.FC<{ privacy: string }> = ({ privacy }) => {
  switch (privacy) {
    case 'public':
      return <FiGlobe className="mr-1 inline h-4 w-4" />;
    case 'private':
      return <FiLock className="mr-1 inline h-4 w-4" />;
    case 'unlisted':
      return <FiEye className="mr-1 inline h-4 w-4" />;
    default:
      return null;
  }
};

const UploadRequests = () => {
  const { workspaceId } = useParams();
  const [uploadRequests, setUploadRequests] = useState<IApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUploadRequests = async () => {
      if (!workspaceId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/workspace/${workspaceId}/upload-requests`, {
          withCredentials: true,
        });
        setUploadRequests(response.data.approvalRequests);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch upload requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchUploadRequests();
  }, [workspaceId]);

  const handleApprove = async (req: IApprovalRequest) => {
    if (!req) return console.error('No request found');
    setProcessingRequestId(req._id);
    try {
      await api.post(
        `workspace/${workspaceId}/approval-requests/approve`,
        { req },
        { withCredentials: true }
      );
      setUploadRequests((prev) =>
        prev.map((r) => (r._id === req._id ? { ...r, status: 'approved' } : r))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to approve request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDecline = async (req: IApprovalRequest) => {
    if (!req) return;
    setProcessingRequestId(req._id);
    try {
      await api.post(
        `workspace/${workspaceId}/approval-requests/reject`,
        { req },
        { withCredentials: true }
      );
      setUploadRequests((prev) =>
        prev.map((r) => (r._id === req._id ? { ...r, status: 'rejected' } : r))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to reject request.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRequestReupload = async (req: IApprovalRequest) => {
    if (!req) return;
    setProcessingRequestId(req._id);
    try {
      await api.post(
        `workspace/${workspaceId}/approval-requests/request-reupload`,
        { req },
        { withCredentials: true }
      );
      setUploadRequests((prev) =>
        prev.map((r) => (r._id === req._id ? { ...r, status: 'need_edits' } : r))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to request re-upload.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-10 text-gray-300">
        <FiLoader className="h-12 w-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  // Check if the current user is an approver
  const canApprove = uploadRequests.some(
    (r) => r.approvers?.some((a) => a._id === user?._id) === true
  );
  const canDecline = canApprove;

  //Main Render
  return (
    <>
      {error && (
        <div className="m-10 flex items-center gap-3 rounded-md bg-red-900/50 p-4 text-red-300 ring-1 ring-red-500/30">
          <FiAlertTriangle className="h-5 w-5 flex-shrink-0" /> {error}
        </div>
      )}
      <div className="min-h-screen bg-neutral-900 p-4 pt-8 text-gray-300 md:p-10">
        <h1 className="font-display mb-8 text-5xl font-bold text-white">Upload Requests</h1>

        {/*Permission Warning*/}
        {!canApprove && !canDecline && (
          <div className="mb-8 flex items-center gap-3 rounded-md bg-yellow-900/50 p-4 text-yellow-300 ring-1 ring-yellow-500/30">
            <FiAlertTriangle className="h-5 w-5 flex-shrink-0" />
            You do not have permission to approve requests. View-only mode.
          </div>
        )}
        {uploadRequests === null || uploadRequests?.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-4 border-dashed border-neutral-700 p-16 text-center">
            <span className="block text-2xl font-semibold text-white">No Upload Requests</span>
            <p className="mt-2 text-gray-400">
              When an editor submits a video, it will appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {uploadRequests.map((req) => {
                const isProcessing = processingRequestId === req._id;
                const isPending = req.status === 'pending';
                const isDisabled = !canApprove || !isPending || isProcessing;

                return (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden rounded-2xl bg-neutral-800 shadow-xl ring-1 ring-white/10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                      <div className="col-span-1 bg-black lg:p-4">
                        <video
                          src={req.video.url}
                          poster={req.video.thumbnail}
                          controls
                          className="aspect-video w-full rounded-lg bg-black"
                        />
                      </div>
                      <div className="col-span-1 space-y-4 p-6 lg:col-span-2">
                        <div className="flex items-start justify-between">
                          <StatusBadge status={req.status} />
                          <div className="text-right text-sm text-gray-500">
                            <p>
                              Requested by:{' '}
                              <span className="font-medium text-gray-300">
                                {req.requester?.name}
                              </span>
                            </p>
                            <p>
                              Date:{' '}
                              <span className="font-medium text-gray-300">
                                {new Date(req.video.uploadedAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>

                        <h2 className="font-display text-3xl font-bold text-white">
                          {req.video.title}
                        </h2>

                        <p className="whitespace-pre-wrap text-gray-400">{req.video.description}</p>
                        {req.video.tags && req.video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.video.tags.map((tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1 rounded-full bg-indigo-500/30 px-3 py-1 text-sm text-indigo-200"
                              >
                                <FiTag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span className="font-medium text-white capitalize">
                            Category: {req.video.category}
                          </span>
                          <span className="font-medium text-white capitalize">
                            <PrivacyIcon privacy={req.video.privacy} />
                            {req.video.privacy}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isPending ? (
                      <div className="flex flex-wrap gap-4 border-t border-white/10 bg-neutral-800/50 p-4">
                        <motion.button
                          onClick={() => handleApprove(req)}
                          disabled={isDisabled}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                          whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                        >
                          {isProcessing ? <FiLoader className="animate-spin" /> : <FiCheck />}
                          {isProcessing ? 'Approving...' : 'Approve & Upload'}
                        </motion.button>

                        <motion.button
                          onClick={() => handleDecline(req)}
                          disabled={isDisabled}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                          whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                        >
                          <FiX /> Decline
                        </motion.button>

                        <motion.button
                          onClick={() => handleRequestReupload(req)}
                          disabled={isDisabled}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-600 px-5 py-3 font-bold text-white transition-all hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
                          whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                        >
                          <FiRefreshCw /> Request Re-upload
                        </motion.button>
                      </div>
                    ) : (
                      <div className="border-t border-white/10 bg-neutral-800/50 p-4">
                        {req.status === 'approved' && req.approvedBy ? (
                          <div className="flex items-center gap-2 text-lg font-medium text-green-400">
                            <FiCheckCircle />
                            <span>Approved by {req.approvedBy.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-lg font-medium text-gray-400">
                            <span className="capitalize">Final Status: {req.status}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadRequests;
