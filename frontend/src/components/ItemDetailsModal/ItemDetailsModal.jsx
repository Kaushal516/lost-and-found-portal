import { useEffect, useState, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import styles from "./ItemDetailsModal.module.css";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
const SimilarItemsCarousel = lazy(() => import("../SimilarItemsCarousel/SimilarItemsCarousel"));
import { X, MapPin, Calendar, Tag, Info, User, Clock, Share2 } from "lucide-react";
import ContactModal from "../ContactModal/ContactModal";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";
import { formatFoundStatus, formatLostStatus } from "../../utils/statusMapper";
import { useLanguage } from "../../context/LanguageContext";

const ItemDetailsModal = ({ item, type, onClose }) => {
    const { user, isAdmin } = useAuth();
    const { t } = useLanguage();
    const [showContact, setShowContact] = useState(false);
    const [itemStatus, setItemStatus] = useState(item.status || "active");
    const currentUserId = user?.id;
    const posterId = item.postedBy?._id ?? item.postedBy;
    const isOwner = currentUserId && String(posterId) === String(currentUserId);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleBackdropClick = (e) => {
        e.stopPropagation();
        if (e.target.classList.contains(styles.backdrop)) {
            onClose();
        }
    };

    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleClaim = async () => {
        if (type !== "found") return;
        try {
            if (!currentUserId) {
                alert(t('item.loginToClaim'));
                return;
            }
            const res = await api.put(`/found/${item._id}/claim`);
            setItemStatus(res.data.status);
        } catch (err) {
            console.error("Failed to claim item", err);
            alert(err.response?.data?.message || t('common.error'));
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        const text = `Check out this ${type} item: ${item.title}`;
        if (navigator.share) {
            navigator.share({ title: item.title, text, url });
        } else {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(twitterUrl, '_blank');
        }
    };


    const isClaimable = type === "found" && itemStatus === "active";
    const btnText = itemStatus === "active" ? t('item.claimItem') : (itemStatus === "resolved" ? t('item.resolved') : t('item.claimed'));

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={handleClose} aria-label={t('common.cancel')}>
                    <X size={24} />
                </button>

                <div className={styles.topSection}>
                    <div className={styles.imageSection}>
                        {item.images && item.images.length > 0 ? (
                            <ImageCarousel images={item.images} />
                        ) : (
                            <div className={styles.noImage}>
                                <Info size={48} color="var(--gray-400)" />
                                <p>{t('item.noPhotos')}</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{item.title}</h2>
                            <div className={styles.headerRight}>
                                <div className={styles.utilityBar}>
                                    <button onClick={handleShare} className={styles.utilityBtn} title={t('item.shareItem')}>
                                        <Share2 size={18} />
                                    </button>
                                </div>
                                <span className={`${styles.statusBadge} ${itemStatus === "active" ? styles.active : itemStatus === "resolved" ? styles.resolved : styles.process}`}>
                                    {type === "lost" ? formatLostStatus(itemStatus, t) : formatFoundStatus(itemStatus, t)}
                                </span>
                            </div>
                        </div>

                        <p className={styles.category}>{t(`categories.${item.category}`)}</p>

                        <div className={styles.detailsList}>
                            <div className={styles.detailItem}>
                                <MapPin size={18} className={styles.icon} />
                                <span><strong>{t('item.location')}:</strong> {item.location}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar size={18} className={styles.icon} />
                                <span><strong>{t('item.date')}:</strong> {new Date(type === "lost" ? item.dateLost : item.dateFound).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <User size={18} className={styles.icon} />
                                <span><strong>{t('item.postedBy')}:</strong> {item.postedBy?.firstName ? `${item.postedBy.firstName} ${item.postedBy.lastName}` : t('item.unknownUser')}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Clock size={18} className={styles.icon} />
                                <span><strong>{t('item.postedOn')}:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h4>{t('item.descriptionHeading')}</h4>
                            <p>{item.description || t('item.noDescription')}</p>
                        </div>

                        {item.tags && item.tags.length > 0 && (
                            <div className={styles.tagsContainer}>
                                <Tag size={16} className={styles.icon} />
                                {item.tags.map((tag, i) => (
                                    <span key={i} className={styles.tagPill}>{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className={styles.actions}>
                            {type === "found" && !isAdmin && (
                                <button
                                    className={`${styles.actionBtn} ${styles.primaryBtn}`}
                                    onClick={handleClaim}
                                    disabled={!isClaimable || isOwner}
                                >
                                    {isOwner ? t('item.yourPost') : btnText}
                                </button>
                            )}

                            {!isAdmin && !isOwner && (
                                <button
                                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                    onClick={() => setShowContact(true)}
                                >
                                    {t('item.contactPoster')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIMILAR ITEMS CAROUSEL */}
                <div className={styles.bottomSection}>
                    <Suspense fallback={<div className={styles.loadingPlaceholder}>Loading similar items...</div>}>
                        <SimilarItemsCarousel currentItem={item} type={type} />
                    </Suspense>
                </div>
            </div>

            {showContact && (
                <ContactModal
                    user={item.postedBy}
                    onClose={() => setShowContact(false)}
                />
            )}
        </div>,
        document.body
    );
};

export default ItemDetailsModal;
