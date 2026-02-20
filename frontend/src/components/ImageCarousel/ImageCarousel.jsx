import { useState } from "react";
import styles from "./ImageCarousel.module.css";

const ImageCarousel = ({ images }) => {
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const next = () =>
        setIndex((prev) => (prev + 1) % images.length);

    const prev = () =>
        setIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );

    return (
        <div className={styles.carousel}>
            <img src={images[index]} alt="item" />

            {images.length > 1 && (
                <>
                    <button className={styles.left} onClick={prev}>‹</button>
                    <button className={styles.right} onClick={next}>›</button>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
