import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "./Chat.module.css";
import useAuth from "../../hooks/useAuth";
import socket from "../../socket";

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const { isAdmin, user } = useAuth();
  const [view, setView] = useState("my"); // "my" | "lost" | "found"

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Admin or User -> Always fetch direct chats
        const res = await api.get("/chat");
        if (Array.isArray(res.data)) {
          setChats(res.data);
        } else {
          setChats([]);
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();

    // Setup User Room
    if (user) {
      socket.emit("setup", user);
    }

    // Real-time update for chat list order and unread count
    const handleNotification = () => fetchChats();

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [selectedChatId, user, view, isAdmin]); // Re-fetch when view changes

  return (
    <div className={styles.chatList}>
      {isAdmin && (
        <div className={styles.adminHeader}>
          <h3>Support Chats</h3>
        </div>
      )}

      {chats.length === 0 && <p className={styles.noChats}>No active chats</p>}
      {(isAdmin ? chats : chats.slice(0, 1)).map((chat) => (
        <div
          key={chat._id}
          className={`${styles.chatListItem} ${selectedChatId === chat._id ? styles.active : ""}`}
          onClick={() => onSelectChat(chat)}
        >

          <div className={styles.chatDetails}>
            <span className={styles.chatName}>
              {(() => {
                if (isAdmin) {
                  // For Admin: Show the User's name
                  const userPart = chat.participants[0];
                  return userPart?.username || "Unknown User";
                }

                // For User: Show "Admin"
                return "Admin";
              })()}
            </span>
          </div>
          {chat.unreadCount > 0 && <span className={styles.unreadBadge}>{chat.unreadCount}</span>}
        </div>
      ))}
      {
        isAdmin && (
          <button
            className={styles.newChatBtn}
            onClick={() => window.location.href = '/admin/users'}
          >
            + Start New Chat
          </button>
        )
      }
    </div >
  );
};

export default ChatList;
