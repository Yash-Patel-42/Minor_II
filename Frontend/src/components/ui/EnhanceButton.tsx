import React, { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import api from "../../utils/axiosInstance";

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
      const response = await api.post(url, {
        data,
      });
      onEnhanced(response.data);
    } catch (error) {
      console.error("Error enhancing data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={loading || !data}
      className="bg-background text-text hover:bg-background-hover group relative rounded-full p-2 transition-all disabled:cursor-not-allowed disabled:bg-neutral-600"
    >
      {loading ? (
        <div className="border-border/50 border-t-border h-5 w-5 animate-spin rounded-full border-2" />
      ) : (
        <FaWandMagicSparkles className="h-5 w-5" />
      )}
      <span className="bg-background text-text absolute -top-10 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-md px-2 py-1 text-sm opacity-0 transition-opacity group-hover:opacity-100">
        Enhance with AI
      </span>
    </button>
  );
};

export default EnhanceButton;
