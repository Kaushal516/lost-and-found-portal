import { useEffect, useState } from "react";
import api from "../../utils/api";
import FoundItemCard from "../ItemCard/FoundItemCard";
import LostItemCard from "../ItemCard/LostItemCard";
import styles from "./SimilarItemsCarousel.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const SimilarItemsCarousel = ({ currentItem, type }) => {
    const [similarItems, setSimilarItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchSimilarItems = async () => {
            try {
                // Simple similarity logic: match by category
                // In a real app we might use our AI embeddings or tag matching
                const endpoint = type === "lost" ? "/lost" : "/found";
                const res = await api.get(endpoint);

                let filtered = res.data.filter(
                    item => item._id !== currentItem._id && item.category === currentItem.category
                );

                // If not enough by category, just get latest
                if (filtered.length < 3) {
                    const others = res.data.filter(
                        item => item._id !== currentItem._id && item.category !== currentItem.category
                    );
                    filtered = [...filtered, ...others];
                }

                // Limit to 6 items
                setSimilarItems(filtered.slice(0, 6));
            } catch (err) {
                console.error("Error fetching similar items", err);
            } finally {
                setLoading(false);
            }
        };

        if (currentItem) {
            fetchSimilarItems();
        }
    }, [currentItem, type]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === "left" ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) return null;
    if (similarItems.length === 0) return null;

    return (
        <div className={styles.carouselContainer}>
            <h3 className={styles.carouselTitle}>You Might Also Be Looking For</h3>

            <div className={styles.carouselWrapper}>
                <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={() => scroll("left")}>
                    <ChevronLeft size={24} />
                </button>

                <div className={styles.itemsScrollRow} ref={scrollRef}>
                    {similarItems.map(item => (
                        <div key={item._id} className={styles.itemWrapper}>
                            {type === "lost" ? (
                                <LostItemCard item={item} />
                            ) : (
                                <FoundItemCard item={item} />
                            )}
                        </div>
                    ))}
                </div>

                <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={() => scroll("right")}>
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default SimilarItemsCarousel;
