import { useAuth } from "@context/AuthProvider";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat: React.FC = () => {
  const { user } = useAuth();
  const username = user?.name || "Jhon Doe";
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { senderName: string; messageContent: string }[]
  >([]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (data: { senderName: string; messageContent: string }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    );
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      senderName: username,
      messageContent: message,
    });
    setMessage("");
  };

  return (
    <div>
      <h1>Chat App</h1>
      <input
        type="text"
        placeholder="Enter Message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.senderName}: </strong>
            {msg.messageContent}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
