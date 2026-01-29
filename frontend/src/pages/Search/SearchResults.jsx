import { useState } from "react";
import styles from "./Search.module.css";
import useClaimItem from "../../hooks/useClaimItem";
import { useEffect } from "react";

const SearchResults = ({ results }) => {
  const [items, setItems] = useState(results);
  const { claimItem, loading, error } = useClaimItem();
  useEffect(() => {
  setItems(results);
}, [results]);

  const handleClaim = async (itemId) => {
    try {
      await claimItem(itemId);

      // Update UI immediately
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, status: "claimed" }
            : item
        )
      );
    } catch {
      // error already handled in hook
    }
  };

  if (!items.length) {
    return (
      <div style={{
        marginTop: '3rem',
        padding: '3rem',
        textAlign: 'center',
        fontSize: '1.1rem',
        color: 'var(--gray-500)',
        background: 'white',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        No matching found items
      </div>
    );
  }

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.resultsGrid}>
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
              Date:{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>

            {item.status === "active" ? (
              <button
                className={styles.claimBtn}
                onClick={() => handleClaim(item._id)}
                disabled={loading}
              >
                {loading ? "Claiming..." : "Claim"}
              </button>
            ) : (
              <button className={styles.claimedBtn} disabled>
                Claimed
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResults;
