import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import styles from "./Chat.module.css";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item");
  const itemType = searchParams.get("type");

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🔥 CREATE / FETCH CHAT WHEN PAGE OPENS
  useEffect(() => {
    if (!itemId || !itemType) return;

    const accessChat = async () => {
      const res = await api.post("/chat", {
        itemId,
        itemType
      });

      setSelectedChat(res.data);

      // Load messages
      const msgs = await api.get(`/chat/${res.data._id}`);
      setMessages(msgs.data);
    };

    accessChat();
  }, [itemId, itemType]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim() || !selectedChat) return;

    const res = await api.post("/chat/message", {
      chatId: selectedChat._id,
      text
    });

    setMessages(prev => [...prev, res.data]);
    setText("");
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>Chats</h3>
      </aside>

      <main className={styles.chatArea}>
        {!selectedChat ? (
          <p className={styles.placeholder}>
            Select a chat to start messaging
          </p>
        ) : (
          <>
            <div className={styles.messages}>
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={styles.message}
                >
                  <strong>
                    {msg.senderUser
                      ? msg.senderUser.username
                      : "Admin"}
                    :
                  </strong>{" "}
                  {msg.text}
                </div>
              ))}
            </div>

            <div className={styles.inputBox}>
              <input
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Chat;
