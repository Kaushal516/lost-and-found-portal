import styles from "./MyPosts.module.css";

const FoundPosts = ({ items }) => {
  return (
    <div className={styles.section}>
      <h3>Found Items</h3>

      {items.length === 0 && <p>No found items posted</p>}

      {items.map(item => (
        <div key={item._id} className={styles.row}>
          <img
            src={item.images[0]}
            alt={item.title}
            className={styles.thumb}
          />
          <span>{item.title}</span>
          <span>{item.status}</span>
        </div>
      ))}
    </div>
  );
};

export default FoundPosts;
