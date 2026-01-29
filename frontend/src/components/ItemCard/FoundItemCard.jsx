import { useNavigate } from "react-router-dom";
import { formatFoundStatus } from "../utils/statusMapper";
import styles from "./ItemCard.module.css";

const FoundItemCard = ({ item }) => {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>{item.title}</h4>
        <span className={styles.status}>
          {formatFoundStatus(item.status)}
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p>📍 {item.location || "Location not specified"}</p>

        <p>
          🗓️ Found on:{" "}
          {item.dateFound
            ? new Date(item.dateFound).toLocaleDateString()
            : "Unknown"}
        </p>

        <p>✉️ {item.postedBy?.email || "Email not available"}</p>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={styles.chatBtn}
          onClick={() =>
            navigate(`/chat?item=${item._id}&type=found`)
          }
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
};

export default FoundItemCard;
