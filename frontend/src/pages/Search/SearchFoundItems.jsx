import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import FoundItemCard from "../../components/ItemCard/FoundItemCard";
import styles from "./SearchFoundItems.module.css";

const SearchFoundItems = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") === "returned" ? "resolved" : "");

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "returned") {
      setStatusFilter("resolved");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/found");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch found items", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesQuery =
      query === "" ||
      item.title.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === "" || item.category === category;

    const matchesDate =
      date === "" ||
      new Date(item.dateFound).toDateString() ===
      new Date(date).toDateString();

    const matchesStatus =
      statusFilter === "" || (item.status || "active") === statusFilter;

    return matchesQuery && matchesCategory && matchesDate && matchesStatus;
  });

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Search Found Items</h2>

      {/* SEARCH BAR */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search item..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Available</option>
          <option value="resolved">Returned</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => { }}
          aria-label="Search"
        >
          Search
        </button>
      </div>

      {/* RESULTS */}
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
        <p className={styles.message}>No items found</p>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => (
            <FoundItemCard key={item._id} item={item} currentUserId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFoundItems;
