import { useNavigate } from "react-router-dom";
import { formatLostStatus } from "../../utils/statusMapper";
import styles from "./ItemCard.module.css";

const LostItemCard = ({ item }) => {
  const navigate = useNavigate();

  if (!item) return null;

  const isReturned = item.status === "resolved";

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>
          {item.title || "Untitled Item"}
        </h4>
        <span className={styles.status}>
          {formatLostStatus(item.status)}
        </span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p>
          📍 {item.location || "Location not specified"}
        </p>

        <p>
          🗓️ Lost on:{" "}
          {item.dateLost
            ? new Date(item.dateLost).toLocaleDateString()
            : "Unknown"}
        </p>

        {isReturned && (
          <p>
            ✅ Returned on:{" "}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>
        )}

        <p>
          ✉️ {item.postedBy?.email || "Email not available"}
        </p>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={styles.chatBtn}
          onClick={() =>
            navigate(`/chat?item=${item._id}&type=lost`)
          }
        >
          💬 Chat
        </button>
      </div>
    </div>
  );
};

export default LostItemCard;
