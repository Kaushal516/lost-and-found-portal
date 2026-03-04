import { useState } from "react";
import { formatLostStatus } from "../../utils/statusMapper";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import ContactModal from "../ContactModal/ContactModal";
import ItemDetailsModal from "../ItemDetailsModal/ItemDetailsModal";
import styles from "./ItemCard.module.css";

const LostItemCard = ({ item, currentUserId }) => {
  const [showContact, setShowContact] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!item) return null;

  const posterId = item.postedBy?._id ?? item.postedBy;
  const isOwner = currentUserId && String(posterId) === String(currentUserId);
  const status = item.status || "active";

  return (
    <div className={styles.card} onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
      <div>
        <ImageCarousel images={item.images || []} />
      </div>

      <div className={styles.header}>
        <h3 className={styles.title}>{item.title || "Untitled Item"}</h3>
        <span className={`${styles.status} ${status === "active"
          ? styles.statusActive
          : status === "In Process"
            ? styles.statusProcess
            : styles.statusResolved
          }`}>
          {formatLostStatus(status)}
        </span>
      </div>

      <div className={styles.body}>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Location:</strong> {item.location || "Not specified"}</p>
        <p>
          <strong>Lost on:</strong>{" "}
          {item.dateLost
            ? new Date(item.dateLost).toLocaleDateString()
            : "Unknown"}
        </p>
        {status === "resolved" && (
          <p>
            <strong>Returned on:</strong>{" "}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.contactBtn}
          onClick={(e) => { e.stopPropagation(); setShowContact(true); }}
          disabled={isOwner}
          title={isOwner ? "You posted this item" : "Contact the person who lost this item"}
        >
          {isOwner ? "Your Report" : "Contact Poster"}
        </button>
      </div>

      {showContact && (
        <ContactModal
          user={item.postedBy}
          onClose={() => setShowContact(false)}
        />
      )}

      {showDetails && (
        <div>
          <ItemDetailsModal
            item={item}
            type="lost"
            onClose={() => setShowDetails(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LostItemCard;
