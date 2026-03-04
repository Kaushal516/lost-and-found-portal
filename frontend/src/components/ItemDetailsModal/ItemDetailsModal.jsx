import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ItemDetailsModal.module.css";
import ImageCarousel from "../ImageCarousel/ImageCarousel";
import SimilarItemsCarousel from "../SimilarItemsCarousel/SimilarItemsCarousel";
import { X, MapPin, Calendar, Tag, Info, User, Clock } from "lucide-react";
import ContactModal from "../ContactModal/ContactModal";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";
import { formatFoundStatus, formatLostStatus } from "../../utils/statusMapper";

const ItemDetailsModal = ({ item, type, onClose }) => {
    const { user, isAdmin } = useAuth();
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
                alert("Please login to claim this item");
                return;
            }
            const res = await api.put(`/found/${item._id}/claim`);
            setItemStatus(res.data.status);
        } catch (err) {
            console.error("Failed to claim item", err);
            alert(err.response?.data?.message || "Failed to claim item");
        }
    };

    const isClaimable = type === "found" && itemStatus === "active";
    const btnText = itemStatus === "active" ? "Claim Item" : (itemStatus === "resolved" ? "Resolved" : "Claimed");

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                    <X size={24} />
                </button>

                <div className={styles.topSection}>
                    <div className={styles.imageSection}>
                        {item.images && item.images.length > 0 ? (
                            <ImageCarousel images={item.images} />
                        ) : (
                            <div className={styles.noImage}>
                                <Info size={48} color="var(--gray-400)" />
                                <p>No Photos Available</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{item.title}</h2>
                            <span className={`${styles.statusBadge} ${itemStatus === "active" ? styles.active : itemStatus === "resolved" ? styles.resolved : styles.process}`}>
                                {type === "lost" ? formatLostStatus(itemStatus) : formatFoundStatus(itemStatus)}
                            </span>
                        </div>

                        <p className={styles.category}>{item.category}</p>

                        <div className={styles.detailsList}>
                            <div className={styles.detailItem}>
                                <MapPin size={18} className={styles.icon} />
                                <span><strong>Location:</strong> {item.location}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Calendar size={18} className={styles.icon} />
                                <span><strong>Date:</strong> {new Date(type === "lost" ? item.dateLost : item.dateFound).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <User size={18} className={styles.icon} />
                                <span><strong>Posted By:</strong> {item.postedBy?.firstName ? `${item.postedBy.firstName} ${item.postedBy.lastName}` : "Unknown User"}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Clock size={18} className={styles.icon} />
                                <span><strong>Posted On:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h4>Description</h4>
                            <p>{item.description || "No description provided."}</p>
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
                                    {isOwner ? "Your Post" : btnText}
                                </button>
                            )}

                            {!isAdmin && !isOwner && (
                                <button
                                    className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                                    onClick={() => setShowContact(true)}
                                >
                                    Contact Poster
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIMILAR ITEMS CAROUSEL */}
                <div className={styles.bottomSection}>
                    <SimilarItemsCarousel currentItem={item} type={type} />
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
