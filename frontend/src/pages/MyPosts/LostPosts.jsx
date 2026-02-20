import styles from "./MyPosts.module.css";

const LostPosts = ({ items }) => {
  return (
    <div className={styles.section}>
      <h3>Your Lost Reports</h3>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't reported any lost items yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item, index) => {
            const date = new Date(item.createdAt);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={item._id}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.imageBox}>
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className={styles.thumb} />
                  ) : (
                    <div className={styles.noImage}>NO PHOTO PROVIDED</div>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.headerRow}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <div className={`${styles.statusBadge} ${item.status === "resolved" ? styles.statusResolved : styles.statusActive}`}>
                      {item.status || "active"}
                    </div>
                  </div>

                  <div className={styles.itemDate}>
                    <span>📅</span>
                    {formattedDate} at {formattedTime}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LostPosts;
