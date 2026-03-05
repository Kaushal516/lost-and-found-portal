import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import ChatList from "./ChatList";
import styles from "./Chat.module.css";
import socket from "../../socket";
import { useLanguage } from "../../context/LanguageContext";

const Chat = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item");
  const itemType = searchParams.get("type");
  const { user, isAdmin } = useAuth();

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ((!itemId || !itemType) && !searchParams.get("user")) return;

    const accessChat = async () => {
      try {
        let res;
        // Direct chat mode
        if (searchParams.get("type") === "direct" && searchParams.get("user")) {
          res = await api.post("/chat/direct", { userId: searchParams.get("user") });
        } else if (itemId && itemType) {
          // Item chat mode
          res = await api.post("/chat", { itemId, itemType });
        } else {
          return;
        }

        setSelectedChat(res.data);
        const msgs = await api.get(`/chat/${res.data._id}`);
        setMessages(msgs.data);
      } catch (err) {
        console.error("Failed to load chat", err);
      }
    };

    accessChat();
  }, [itemId, itemType, searchParams]);

  // Read Logic & Admin Auto-Join Hook?
  useEffect(() => {
    if (selectedChat?._id) {
      api.put("/chat/read", { chatId: selectedChat._id }).catch(() => { });

      // If Admin & Community View (implied by admin is null?), 
      // User asked for "autojoin".
      if (isAdmin && !selectedChat.admin) {
        api.post("/chat/join", { chatId: selectedChat._id })
          .then(res => setSelectedChat(res.data))
          .catch(console.error);
      }
    }
  }, [selectedChat, isAdmin]);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const sendMessage = async () => {
    if ((!text.trim() && !file) || !selectedChat) return;

    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      if (text.trim()) formData.append("text", text.trim());
      if (file) formData.append("file", file);

      // We need to set Content-Type to multipart/form-data? Axios does it automatically if data is FormData
      const res = await api.post("/chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };



  const getSenderName = (msg) => {
    if (msg.senderAdmin) return "Admin";
    if (msg.senderUser) return msg.senderUser.username || "User";
    return "Unknown";
  };

  const isMyMessage = (msg) => {
    if (!user?.id) return false;
    if (isAdmin) return msg.senderAdmin?._id === user.id;
    return msg.senderUser?._id === user.id;
  };



  useEffect(() => {
    if (!selectedChat) return;

    socket.emit("joinChat", selectedChat._id);

    // Listen for incoming messages
    socket.on("message received", (newMessage) => {
      if (selectedChat._id === newMessage.chat) {
        setMessages((prev) => [...prev, newMessage]);
        // Also mark as read immediately if window is focused? 
        // For simplicity, let useEffect handle it via dependency or explicit call?
        // Actually, if we are here, we are "reading" it.
        api.put("/chat/read", { chatId: selectedChat._id }).catch(() => { });
      }
    });

    // Listen for read receipts
    socket.on("messagesRead", ({ chatId }) => {
      if (selectedChat && selectedChat._id === chatId) {
        setMessages((prev) =>
          prev.map(msg => ({ ...msg, read: true }))
        );
      }
    });

    return () => {
      socket.off("message received");
      socket.off("messagesRead");
    };
  }, [selectedChat]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3>{t('chat.title')}</h3>
        <ChatList
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            const fetchMsgs = async () => {
              const msgs = await api.get(`/chat/${chat._id}`);
              setMessages(msgs.data);
              // Mark as read explicitly here too potentially, but useEffect covers it
            };
            fetchMsgs();
          }}
          selectedChatId={selectedChat?._id}
        />
      </aside>

      <main className={styles.chatArea}>
        {!selectedChat ? (
          <div className={styles.emptyChatPlaceholder} />
        ) : (
          <>
            <div className={styles.chatLog}>
              {messages.map((msg) => {
                const isMe = isMyMessage(msg);
                return (
                  <div
                    key={msg._id}
                    className={`${styles.messageWrapper} ${isMe ? styles.mine : styles.theirs}`}
                  >
                    <div className={`${styles.message} ${isMe ? styles.myMessage : styles.otherMessage}`}>
                      <div className={styles.messageHead}>
                        <span className={styles.senderName}>{getSenderName(msg)}</span>
                        <span className={styles.timestamp}>
                          {formatTime(msg.createdAt)}
                          {isMe && (
                            <span className={`${styles.tick} ${msg.read ? styles.blue : styles.grey}`}>
                              ✓✓
                            </span>
                          )}
                        </span>
                      </div>
                      {msg.attachment && msg.attachment.url && (
                        <div className={styles.attachment}>
                          <img src={msg.attachment.url} alt="attachment" className={styles.chatImage} />
                        </div>
                      )}
                      {msg.text && <p className={styles.messageText}>{msg.text}</p>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputBox}>
              <div className={styles.inputWrap}>
                <input
                  ref={inputRef}
                  placeholder={t('chat.typeMessage')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
                accept="image/*"
              />
              <button
                className={styles.attachBtn}
                onClick={() => fileInputRef.current.click()}
                title={t('chat.sendImg')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.sendBtn}
                onClick={sendMessage}
                disabled={!text.trim() && !file}
              >
                {file ? t('chat.sendImg') : t('chat.send')}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Chat;
