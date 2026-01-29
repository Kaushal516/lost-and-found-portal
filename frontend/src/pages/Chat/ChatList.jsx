import styles from "./Chat.module.css";

const ChatList = ({ chats, onSelect, activeChat }) => {
  return (
    <div className={styles.chatList}>
      <h3>Chats</h3>

      {chats.map((chat) => (
        <div
          key={chat._id}
          className={
            activeChat?._id === chat._id
              ? styles.activeChat
              : styles.chatItem
          }
          onClick={() => onSelect(chat)}
        >
          <p>Item Chat</p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
