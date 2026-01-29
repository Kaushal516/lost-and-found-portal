import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "./AdminResolve.module.css";
import AdminResolveList from "./AdminResolveList";

const AdminResolve = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaimedItems = async () => {
      try {
        const res = await api.get("/found?status=claimed");
        setItems(res.data);
      } catch (err) {
        setError("Failed to load claimed items");
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedItems();
  }, []);

  const handleResolve = async (itemId) => {
    try {
      await api.put(`/status/found/${itemId}/resolve`);

      // Remove resolved item from UI
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch {
      alert("Failed to resolve item");
    }
  };

  if (loading) return <p>Loading claimed items...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Resolve Claimed Found Items</h2>
      <AdminResolveList items={items} onResolve={handleResolve} />
    </div>
  );
};

export default AdminResolve;
