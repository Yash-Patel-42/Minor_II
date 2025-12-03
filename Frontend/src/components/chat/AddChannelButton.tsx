import { FaPlus } from "react-icons/fa";

interface AddChannelButtonProps {
  onClick: () => void;
}

const AddChannelButton: React.FC<AddChannelButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700"
      title="Create new channel"
    >
      <FaPlus className="h-3.5 w-3.5" />
      New Channel
    </button>
  );
};

export default AddChannelButton;
