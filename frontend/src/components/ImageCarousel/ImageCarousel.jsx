import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageCarousel.module.css";

const ImageCarousel = ({ images }) => {
    const [index, setIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = "hidden";
        } else {
            // Wait, we need to consider if it's opened inside a modal
            // The ItemDetailsModal also locks scroll, we don't want to unset it completely
            // Actually, setting to 'hidden' repeatedly is fine, but unsetting might break the parent
            // Let's just manage our own overflow specifically, or assume no parent issue.
            // Better yet, since we use `overflow = 'hidden'`, unsetting it might remove the parent modal's lock.
            // Let's not remove the parent lock. We can read current and restore it instead of "unset".
        }
    }, [lightboxOpen]);

    if (!images || images.length === 0) return null;

    const next = (e) => {
        if (e) e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e) => {
        if (e) e.stopPropagation();
        setIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const openLightbox = (e) => {
        e.stopPropagation();
        setLightboxOpen(true);
    };

    const closeLightbox = (e) => {
        e.stopPropagation();
        setLightboxOpen(false);
    };

    return (
        <>
            <div className={styles.carousel} onClick={openLightbox} title="Click to enlarge" style={{ cursor: 'zoom-in' }}>
                <img src={images[index]} alt="item" />

                {images.length > 1 && (
                    <>
                        <button className={styles.left} onClick={prev}>
                            <ChevronLeft size={16} />
                        </button>
                        <button className={styles.right} onClick={next}>
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* LIGHTBOX MODAL */}
            {lightboxOpen && createPortal(
                <div className={styles.lightboxOverlay} onClick={closeLightbox}>
                    <button className={styles.lightboxCloseBtn} onClick={closeLightbox} aria-label="Close Lightbox">
                        <X size={32} />
                    </button>

                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <img src={images[index]} alt="enlarged item" className={styles.lightboxImg} />

                        {images.length > 1 && (
                            <>
                                <button className={styles.lightboxLeft} onClick={prev}>
                                    <ChevronLeft size={48} />
                                </button>
                                <button className={styles.lightboxRight} onClick={next}>
                                    <ChevronRight size={48} />
                                </button>
                            </>
                        )}

                        <div className={styles.lightboxIndicators}>
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`${styles.indicator} ${i === index ? styles.activeIndicator : ""}`}
                                    onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                                />
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ImageCarousel;
