import React, { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import api from '../../utils/axiosInstance';

interface EnhanceButtonProps<T> {
  data: string;
  url: string;
  onEnhanced: (enhancedData: T) => void;
}

const EnhanceButton = <T,>({
  data,
  url,
  onEnhanced,
}: EnhanceButtonProps<T>): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    try {
      const response = await api.post(url, { data });
      onEnhanced(response.data);
    } catch (error) {
      console.error('Error enhancing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={loading || !data}
      className="group relative rounded-full bg-indigo-600 p-2 text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-neutral-600"
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
      ) : (
        <FaWandMagicSparkles className="h-5 w-5" />
      )}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-black px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
        Enhance with AI
      </span>
    </button>
  );
};

export default EnhanceButton;
