import { useEffect, useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import LostItemCard from "../../components/ItemCard/LostItemCard";
import styles from "./LostPublic.module.css";

const LostPublic = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/lost");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch lost items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesTitle = item.title
      ?.toLowerCase()
      .includes(query.toLowerCase());

    const matchesDate = date
      ? new Date(item.dateLost).toDateString() === new Date(date).toDateString()
      : true;

    const matchesStatus = !statusFilter || (item.status || "active") === statusFilter;
    const matchesCategory = !categoryFilter || item.category === categoryFilter;

    return matchesTitle && matchesDate && matchesStatus && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recently Lost Items</h2>

      {/* Filters */}
      {/* Filters Removed as per request */}


      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass" style={{ padding: "1.75rem", borderRadius: "20px" }}>
              <div className="skeleton skeletonImage" />
              <div className="skeleton skeletonTitle" />
              <div className="skeleton skeletonText" />
              <div className="skeleton skeletonText" style={{ width: "80%" }} />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <p className={styles.empty}>No matching lost items.</p>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map(item => (
            <LostItemCard key={item._id} item={item} currentUserId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LostPublic;
