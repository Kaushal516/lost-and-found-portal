import { useState } from "react";
import { formatLostStatus } from "../../utils/statusMapper";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import ContactModal from "../ContactModal/ContactModal";
import ItemDetailsModal from "../ItemDetailsModal/ItemDetailsModal";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ItemCard.module.css";

const LostItemCard = ({ item, currentUserId, viewMode = "grid" }) => {
  const [showContact, setShowContact] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useLanguage();

  if (!item) return null;

  const posterId = item.postedBy?._id ?? item.postedBy;
  const isOwner = currentUserId && String(posterId) === String(currentUserId);
  const status = item.status || "active";

  return (
    <div className={`${styles.card} ${viewMode === 'list' ? styles.listCard : ''}`} onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
      <div className={styles.imageWrapper}>
        <ImageCarousel images={item.images || []} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.title || "Untitled Item"}</h3>
          <span className={`${styles.status} ${status === "active"
            ? styles.statusActive
            : status === "In Process"
              ? styles.statusProcess
              : styles.statusResolved
            }`}>
            {formatLostStatus(status, t)}
          </span>
        </div>

        <div className={styles.body}>
          <p><strong>{t('item.category')}:</strong> {t(`categories.${item.category}`)}</p>
          <p><strong>{t('item.location')}:</strong> {item.location || t('common.noItems')}</p>
          <p>
            <strong>{t('item.lostOn')}:</strong>{" "}
            {item.dateLost
              ? new Date(item.dateLost).toLocaleDateString()
              : t('common.noItems')}
          </p>
          {status === "resolved" && (
            <p>
              <strong>{t('item.returnedOn')}:</strong>{" "}
              {new Date(item.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.contactBtn}
            onClick={(e) => { e.stopPropagation(); setShowContact(true); }}
            disabled={isOwner}
            title={isOwner ? t('item.yourReport') : t('item.contactPoster')}
          >
            {isOwner ? t('item.yourReport') : t('item.contactPoster')}
          </button>
        </div>
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
