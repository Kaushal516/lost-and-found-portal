import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import styles from "./AdminClaims.module.css";

const AdminClaims = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Search & Filter State
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchClaimedItems = async () => {
        try {
            // Fetch items with status "In Process"
            const res = await api.get("/found/admin?status=In Process");
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch claims", err);
            setError("Failed to load claims");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaimedItems();
    }, []);

    const handleResolve = async (itemId) => {
        if (!window.confirm("Approve this claim? Item status will become Resolved.")) return;
        setActionLoading(true);
        try {
            await api.put(`/found/${itemId}/resolve`);
            setItems((prev) => prev.filter((item) => item._id !== itemId));
        } catch (err) {
            console.error("Failed to resolve", err);
            alert("Failed to resolve claim");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (itemId) => {
        if (!window.confirm("Reject this claim? Item will become Available again.")) return;
        setActionLoading(true);
        try {
            await api.put(`/found/${itemId}/reject`);
            setItems((prev) => prev.filter((item) => item._id !== itemId));
        } catch (err) {
            console.error("Failed to reject", err);
            alert("Failed to reject claim");
        } finally {
            setActionLoading(false);
        }
    };

    const handleChat = (userId) => {
        navigate(`/chat?type=direct&user=${userId}`);
    };

    if (loading) return <p className={styles.loading}>Loading claims...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    // Filtering Logic
    const filteredItems = items.filter((item) => {
        const matchesQuery =
            query === "" ||
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            (item.claimedBy && (
                item.claimedBy.firstName.toLowerCase().includes(query.toLowerCase()) ||
                item.claimedBy.lastName.toLowerCase().includes(query.toLowerCase()) ||
                item.claimedBy.email.toLowerCase().includes(query.toLowerCase())
            ));

        const matchesCategory =
            category === "" || item.category === category;

        const matchesDate =
            date === "" ||
            new Date(item.dateFound).toDateString() ===
            new Date(date).toDateString();

        return matchesQuery && matchesCategory && matchesDate;
    });

    // Sorting Logic
    const sortedItems = [...filteredItems].sort((a, b) => {
        const dateA = new Date(a.dateFound);
        const dateB = new Date(b.dateFound);

        if (sortBy === "newest") return dateB - dateA;
        if (sortBy === "oldest") return dateA - dateB;
        return 0;
    });

    return (
        <div className={styles.container}>
            <h2>Manage Claims</h2>

            {/* Search & Filter Section */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search by title, description or user..."
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
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
                <button
                    className={styles.searchBtn}
                    onClick={() => { setQuery(""); setCategory(""); setDate(""); setSortBy("newest"); }}
                >
                    Reset
                </button>
            </div>

            {loading ? (
                <div className={styles.list}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass" style={{ padding: "1.75rem", borderRadius: "20px", display: "flex", gap: "2rem" }}>
                            <div className="skeleton" style={{ width: "280px", height: "180px", borderRadius: "12px" }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeletonTitle" style={{ width: "50%" }} />
                                <div className="skeleton skeletonText" />
                                <div className="skeleton skeletonText" />
                                <div className="skeleton skeletonText" style={{ width: "70%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className={styles.error}>{error}</p>
            ) : sortedItems.length === 0 ? (
                <p>No pending claims match your criteria.</p>
            ) : (
                <div className={styles.list}>
                    {sortedItems.map((item) => (
                        <div key={item._id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <ImageCarousel images={item.images} />
                            </div>
                            <div className={styles.content}>
                                <div className={styles.info}>
                                    <h3>{item.title}</h3>
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Claimed By:</strong> {item.claimedBy?.firstName} {item.claimedBy?.lastName} ({item.claimedBy?.email})</p>
                                    <p><strong>Date Found:</strong> {new Date(item.dateFound).toLocaleDateString()}</p>
                                </div>
                                <div className={styles.actions}>
                                    <div className={styles.chatBtns}>
                                        <button
                                            className={styles.chatBtn}
                                            onClick={() => handleChat(item.claimedBy?._id)}
                                            disabled={!item.claimedBy?._id}
                                        >
                                            Chat with Claimant
                                        </button>
                                        <button
                                            className={`${styles.chatBtn} ${styles.posterChatBtn}`}
                                            onClick={() => handleChat(item.postedBy?._id)}
                                            disabled={!item.postedBy?._id}
                                        >
                                            Chat with Poster
                                        </button>
                                    </div>
                                    <div className={styles.decisionBtns}>
                                        <button
                                            className={styles.approveBtn}
                                            onClick={() => handleResolve(item._id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? "..." : "Approve"}
                                        </button>
                                        <button
                                            className={styles.rejectBtn}
                                            onClick={() => handleReject(item._id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? "..." : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminClaims;
