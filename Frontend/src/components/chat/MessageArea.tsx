import { useEffect, useRef, useState } from "react";
import { useChat } from "../../Context/ChatProvider";

const MessageArea = () => {
  const { activeChatChannel, chatMessages, sendMessage, loading } = useChat();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue);
    setInputValue("");
  };

  if (!activeChatChannel) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-b bg-white px-6 py-4">
        <h2 className="text-xl font-semibold"># {activeChatChannel.name}</h2>
        {activeChatChannel.description && (
          <p className="text-sm text-gray-600">
            {activeChatChannel.description}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg._id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                {msg.senderName[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {msg.senderName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.isEdited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                </div>
                <p className="text-gray-800">{msg.messageContent}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t bg-white p-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Message # ${activeChatChannel.name}`}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
};

export default MessageArea;
