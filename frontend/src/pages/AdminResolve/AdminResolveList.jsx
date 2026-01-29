import styles from "./AdminResolve.module.css";

const AdminResolveList = ({ items, onResolve }) => {
  if (!items.length) {
    return <p>No claimed items to resolve</p>;
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <div key={item._id} className={styles.card}>
          <img
            src={item.images[0]}
            alt={item.title}
            className={styles.image}
          />

          <h4>{item.title}</h4>
          <p>Category: {item.category}</p>
          <p>
            Claimed on:{" "}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>

          <button
            className={styles.resolveBtn}
            onClick={() => onResolve(item._id)}
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminResolveList;
