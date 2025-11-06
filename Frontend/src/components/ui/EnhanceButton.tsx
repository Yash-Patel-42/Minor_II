import React, { useState } from 'react';
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
      const response = await api.post(url, {data});
      onEnhanced(response.data);
    } catch (error) {
      console.error('Error enhancing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnhance}
      disabled={loading}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {loading ? 'Enhancing...' : 'Enhance'}
    </button>
  );
};

export default EnhanceButton;
