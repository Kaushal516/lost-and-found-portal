import { useEffect, useState } from "react";
import api from "../../utils/api";
import LostItemCard from "../../components/ItemCard/LostItemCard";
import styles from "./LostPublic.module.css";

const LostPublic = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    api.get("/lost/all").then(res => setItems(res.data));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesTitle = item.title
      ?.toLowerCase()
      .includes(query.toLowerCase());

    const matchesDate = date
      ? new Date(item.dateLost).toDateString() ===
        new Date(date).toDateString()
      : true;

    return matchesTitle && matchesDate;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recently Lost Items</h2>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          placeholder="Search lost items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className={styles.empty}>No matching lost items.</p>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map(item => (
            <LostItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LostPublic;
