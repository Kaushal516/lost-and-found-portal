import { useEffect, useState } from "react";
import styles from "./MyPosts.module.css";
import api from "../../utils/api";
import LostPosts from "./LostPosts";
import FoundPosts from "./FoundPosts";

const MyPosts = () => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const [lostRes, foundRes] = await Promise.all([
        api.get("/my-posts/lost"),
        api.get("/my-posts/found")
      ]);

      setLostItems(lostRes.data);
      setFoundItems(foundRes.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading your posts...</p>;

  return (
    <div className={styles.container}>
      <h2>My Posts</h2>

      <LostPosts items={lostItems} />
      <FoundPosts items={foundItems} />
    </div>
  );
};

export default MyPosts;
