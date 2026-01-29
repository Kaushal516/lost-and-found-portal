import { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const ChatWindow = ({ chat, socketRef }) => {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/chat/${chat._id}/messages`);
      setMessages(res.data);
    };

    fetchMessages();

    socketRef.current.emit("joinChat", chat._id);

    socketRef.current.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stopTyping", () => setIsTyping(false));

    return () => {
      socketRef.current.off("messageReceived");
      socketRef.current.off("typing");
      socketRef.current.off("stopTyping");
    };
  }, [chat, socketRef]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    socketRef.current.emit("stopTyping", chat._id);

    const res = await api.post("/chat/message", {
      chatId: chat._id,
      text
    });

    socketRef.current.emit("newMessage", res.data);
    setMessages((prev) => [...prev, res.data]);
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    socketRef.current.emit("typing", chat._id);

    setTimeout(() => {
      socketRef.current.emit("stopTyping", chat._id);
    }, 1500);
  };

  const getSenderName = (msg) => {
    if (msg.senderAdmin) {
      return `${msg.senderAdmin.username} (Admin)`;
    }
    if (msg.senderUser) {
      return msg.senderUser.username;
    }
    return "Unknown";
  };

  const isMyMessage = (msg) => {
    if (isAdmin) return msg.senderAdmin?._id === user.id;
    return msg.senderUser?._id === user.id;
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={
              isMyMessage(msg)
                ? styles.myMessage
                : styles.otherMessage
            }
          >
            <small>{getSenderName(msg)}</small>
            <p>{msg.text}</p>
          </div>
        ))}

        {isTyping && (
          <p className={styles.typing}>Someone is typing...</p>
        )}
      </div>

      <div className={styles.inputBox}>
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
