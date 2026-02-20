import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatLostStatus } from "../../utils/statusMapper";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import ContactModal from "../ContactModal/ContactModal";
import styles from "./ItemCard.module.css";

const LostItemCard = ({ item, currentUserId }) => {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  if (!item) return null;

  const posterId = item.postedBy?._id ?? item.postedBy;
  const isOwner = currentUserId && String(posterId) === String(currentUserId);
  const status = item.status || "active";
  const statusClass = status === "resolved" ? styles.statusResolved : styles.statusActive;
  const isReturned = status === "resolved";

  return (
    <div className={styles.card}>
      <ImageCarousel images={item.images || []} />

      <div className={styles.header}>
        <h4 className={styles.title}>
          {item.title || "Untitled Item"}
        </h4>
        <span className={`${styles.status} ${statusClass}`}>
          {formatLostStatus(status)}
        </span>
      </div>

      <div className={styles.body}>
        <p>
          📍 <strong>Last Seen Location:</strong>{" "}
          {item.location || "Not specified"}
        </p>

        <p>
          🗓️ Lost on:{" "}
          {item.dateLost
            ? new Date(item.dateLost).toLocaleDateString()
            : "Unknown"}
        </p>

        {isReturned && (
          <p>
            ✅ <strong>Returned on:</strong>{" "}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerButtons}>
          <button
            className={styles.contactBtn}
            onClick={() => setShowContact(true)}
          >
            📞 Contact
          </button>

        </div>
      </div>

      {showContact && (
        <ContactModal
          user={item.postedBy}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
};

export default LostItemCard;
