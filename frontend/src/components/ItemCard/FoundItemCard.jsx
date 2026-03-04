import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import ContactModal from "../ContactModal/ContactModal";
import ItemDetailsModal from "../ItemDetailsModal/ItemDetailsModal";
import { formatFoundStatus } from "../../utils/statusMapper";
import styles from "./ItemCard.module.css";

const FoundItemCard = ({ item, currentUserId }) => {
  const [showContact, setShowContact] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  if (!item) return null;

  const posterId = item.postedBy?._id ?? item.postedBy;
  const isOwner = currentUserId && String(posterId) === String(currentUserId);
  const [itemStatus, setItemStatus] = useState(item.status || "active");

  const handleClaim = async (e) => {
    e.stopPropagation();
    try {
      if (!currentUserId) {
        alert("Please login to claim this item");
        return;
      }
      const res = await api.put(`/found/${item._id}/claim`);
      setItemStatus(res.data.status); // Should be "In Process"
    } catch (err) {
      console.error("Failed to claim item", err);
      alert(err.response?.data?.message || "Failed to claim item");
    }
  };

  const isClaimable = itemStatus === "active";
  const btnText = itemStatus === "active" ? "Claim" : (itemStatus === "resolved" ? "Resolved" : "Claimed");

  return (
    <div className={styles.card} onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
      <div>
        {item.images?.length > 0 && (
          <ImageCarousel images={item.images} />
        )}
      </div>

      <div className={styles.header}>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={`${styles.status} ${itemStatus === "active"
          ? styles.statusActive
          : itemStatus === "In Process"
            ? styles.statusProcess
            : styles.statusResolved
          }`}>
          {formatFoundStatus(itemStatus)}
        </span>
      </div>

      <div className={styles.body}>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p>
          <strong>Found on:</strong>{" "}
          {new Date(item.dateFound).toLocaleDateString()}
        </p>
      </div>

      <div className={styles.footer}>
        {!isAdmin && (
          <button
            className={styles.contactBtn}
            onClick={handleClaim}
            disabled={!isClaimable || isOwner}
            title={
              isOwner
                ? "You cannot claim your own item"
                : isClaimable
                  ? "Click to claim this item"
                  : "This item is already claimed or resolved"
            }
          >
            {isOwner ? "Your Post" : btnText}
          </button>
        )}
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
            type="found"
            onClose={() => setShowDetails(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FoundItemCard;
