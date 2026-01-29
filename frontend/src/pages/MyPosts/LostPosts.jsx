import styles from "./MyPosts.module.css";

const LostPosts = ({ items }) => {
  return (
    <div className={styles.section}>
      <h3>Lost Items</h3>

      {items.length === 0 && <p>No lost items reported</p>}

      {items.map(item => (
        <div key={item._id} className={styles.row}>
          <span>{item.title}</span>
          <span>{item.status}</span>
          <span>
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default LostPosts;
