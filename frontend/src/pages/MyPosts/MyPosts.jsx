import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPosts.module.css";
import api from "../../utils/api";
import LostPosts from "./LostPosts";
import FoundPosts from "./FoundPosts";

const MyPosts = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lost");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          api.get("/my-posts/lost"),
          api.get("/my-posts/found")
        ]);

        setLostItems(lostRes.data);
        setFoundItems(foundRes.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <h2>My Activity</h2>

      {loading ? (
        <>
          <div className={styles.tabs} style={{ pointerEvents: "none", opacity: 0.5 }}>
            <button className={styles.tabBtn}>Lost Items</button>
            <button className={styles.tabBtn}>Found Items</button>
          </div>
          <div className={styles.section}>
            <div className={styles.row} style={{ gridTemplateColumns: "1fr" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass" style={{ padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem" }}>
                  <div className="skeleton skeletonTitle" style={{ width: "40%" }} />
                  <div className="skeleton skeletonText" />
                  <div className="skeleton skeletonText" style={{ width: "60%" }} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabBtn} ${activeTab === "lost" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("lost")}
            >
              Lost Items ({lostItems.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "found" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("found")}
            >
              Found Items ({foundItems.length})
            </button>
          </div>

          <div className={styles.section}>
            {activeTab === "lost" ? (
              <LostPosts items={lostItems} />
            ) : (
              <FoundPosts items={foundItems} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPosts;
