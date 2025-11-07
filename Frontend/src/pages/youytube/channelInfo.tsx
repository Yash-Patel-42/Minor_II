import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../Context/AuthProvider';

export default function ChannelInfo() {
  const { user, channelInfo, fetchYouTubeChannelInfo } = useAuth();
  const { workspaceId } = useParams();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?._id && workspaceId) {
      fetchYouTubeChannelInfo(workspaceId as string);
    }
  }, [user, workspaceId, fetchYouTubeChannelInfo]);

  const handleRefresh = async () => {
    if (!workspaceId) return;
    try {
      setRefreshing(true);
      await fetchYouTubeChannelInfo(workspaceId as string);
    } finally {
      setTimeout(() => setRefreshing(false), 500); // small delay for smooth UX
    }
  };

  // Loading state before first fetch
  if (!channelInfo && !refreshing) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-gray-400">
        <motion.div
          className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        <p className="text-lg">Fetching your YouTube channel data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-900 px-6 py-10 text-gray-100">
      {/* Channel Header */}
<motion.div
  className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-lg relative bg-gray-800"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {/* Banner */}
  <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80">
    <img
      src={
        channelInfo?.thumbnails?.high?.url ||
        channelInfo?.thumbnails?.default?.url ||
        "https://via.placeholder.com/1200x400?text=YouTube+Channel+Banner"
      }
      alt="Channel banner"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Avatar + Info */}
  <div className="flex flex-col items-center mt-8 pb-6 text-center">
    <img
      src={
        channelInfo?.thumbnails?.medium?.url ||
        "https://via.placeholder.com/100?text=Logo"
      }
      alt="Channel avatar"
      className="w-28 h-28 rounded-full border-4 border-gray-900 shadow-xl bg-gray-700"
    />

    <h1 className="mt-4 text-3xl font-bold text-white capitalize">
      {channelInfo?.channelName}
    </h1>
    <p className="text-gray-400 text-sm mt-1">
      Managed by <span className="text-purple-400">{user?.name}</span>
    </p>
  </div>
</motion.div>


      {/* Channel Description */}
      <div className="mt-20 w-full max-w-5xl text-center">
        <p className="text-lg leading-relaxed text-gray-300">
          {channelInfo?.channelDescription || 'No description available.'}
        </p>
      </div>

      {/* Stats Section */}
      <motion.div
        className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <StatCard label="Subscribers" value={channelInfo?.subscribers} />
        <StatCard label="Total Views" value={channelInfo?.views} />
        <StatCard label="Videos Uploaded" value={channelInfo?.totalVideos} />
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-12 flex gap-4">
        <motion.button
          onClick={handleRefresh}
          disabled={refreshing}
          whileHover={{ scale: refreshing ? 1 : 1.05 }}
          whileTap={{ scale: refreshing ? 1 : 0.95 }}
          className={`rounded-lg px-6 py-3 text-white shadow-md transition ${
            refreshing ? 'cursor-not-allowed bg-purple-800' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Stats'}
        </motion.button>
      </div>
    </div>
  );
}

// ✅ Stat Card Component
function StatCard({ label, value }: { label: string; value?: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-xl border border-gray-700 bg-gray-800 p-6 text-center shadow-lg"
    >
      <h3 className="text-2xl font-semibold text-white">{value ?? '—'}</h3>
      <p className="mt-1 text-sm tracking-wide text-gray-400 uppercase">{label}</p>
    </motion.div>
  );
}
