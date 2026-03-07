import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import ImageCarousel from "../../components/ImageCarousel/ImageCarousel";
import { LayoutGrid, List } from "lucide-react";
import styles from "./AdminFoundItems.module.css";

const AdminFoundItems = () => {
    const [searchParams] = useSearchParams();
    const initialStatus = searchParams.get("status") || "";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("list"); // grid or list
    const navigate = useNavigate();

    // Search & Filter State
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [date, setDate] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchFoundItems = async () => {
        try {
            // Fetch all found items
            const res = await api.get("/found/admin");
            setItems(res.data);
        } catch (err) {
            console.error("Failed to fetch found items", err);
            setError("Failed to load found items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const statusParam = searchParams.get("status");
        if (statusParam) {
            setStatusFilter(statusParam);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchFoundItems();
    }, []);

    // Actions
    const handleResolve = async (itemId) => {
        if (!window.confirm("Mark this item as Resolved?")) return;
        setActionLoading(true);
        try {
            await api.put(`/found/${itemId}/resolve`);
            setItems((prev) => prev.map(item => item._id === itemId ? { ...item, status: "resolved" } : item));
        } catch (err) {
            console.error("Failed to resolve", err);
            alert("Failed to resolve item");
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveClaim = async (itemId) => {
        if (!window.confirm("Approve this claim? Item status will become Resolved.")) return;
        try {
            await api.put(`/found/${itemId}/resolve`);
            setItems((prev) => prev.map(item => item._id === itemId ? { ...item, status: "resolved" } : item));
        } catch (err) {
            console.error("Failed to resolve", err);
            alert("Failed to resolve claim");
        }
    };

    const handleRejectClaim = async (itemId) => {
        if (!window.confirm("Reject this claim? Item will become Active again.")) return;
        try {
            await api.put(`/found/${itemId}/reject`);
            setItems((prev) => prev.map(item => item._id === itemId ? { ...item, status: "active", claimedBy: null } : item));
        } catch (err) {
            console.error("Failed to reject", err);
            alert("Failed to reject claim");
        }
    };

    const handleChat = (userId) => {
        navigate(`/chat?type=direct&user=${userId}`);
    };

    // Filtering Logic
    const filteredItems = items.filter((item) => {
        const matchesQuery =
            query === "" ||
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase());

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
            <div className={styles.header}>
                <h2>Manage Found Items</h2>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleActive : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleActive : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div className={styles.searchBar}>
                {/* ... (keep existing inputs) */}
                <input
                    type="text"
                    placeholder="Search by title or description..."
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
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
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
                    onClick={() => { setQuery(""); setCategory(""); setStatusFilter(""); setDate(""); setSortBy("newest"); }}
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
                <p>No found items match your criteria.</p>
            ) : (
                <div className={`${styles.list} ${viewMode === 'grid' ? styles.gridView : ''}`}>
                    {sortedItems.map((item) => (
                        <div key={item._id} className={`${styles.card} ${viewMode === 'grid' ? styles.gridCard : ''}`}>
                            <div className={styles.imageContainer}>
                                {item.images && item.images.length > 0 ? (
                                    <ImageCarousel images={item.images} />
                                ) : (
                                    <div className={styles.placeholderImage}>No Image</div>
                                )}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.info}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <h3>{item.title}</h3>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.8rem",
                                            backgroundColor: item.status === "resolved" ? "#d1fae5" : item.status === "In Process" ? "#fef3c7" : "#fee2e2",
                                            color: item.status === "resolved" ? "#065f46" : item.status === "In Process" ? "#92400e" : "#991b1b"
                                        }}>
                                            {item.status || "active"}
                                        </span>
                                    </div>
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Location:</strong> {item.location}</p>
                                    <p><strong>Date Found:</strong> {new Date(item.dateFound).toLocaleDateString()}</p>
                                    <p><strong>Posted By:</strong> {item.postedBy?.firstName} {item.postedBy?.lastName} ({item.postedBy?.email})</p>
                                    {item.claimedBy && (
                                        <p><strong>Claimed By:</strong> {item.claimedBy.firstName} {item.claimedBy.lastName} ({item.claimedBy.email})</p>
                                    )}
                                    <p><strong>Description:</strong> {item.description}</p>
                                </div>
                                <div className={styles.actions}>
                                    <div className={styles.chatBtns}>
                                        {item.claimedBy && (
                                            <button
                                                className={styles.chatBtn}
                                                onClick={() => handleChat(item.claimedBy?._id)}
                                                disabled={!item.claimedBy?._id}
                                            >
                                                Chat with Claimant
                                            </button>
                                        )}
                                        <button
                                            className={`${styles.chatBtn} ${styles.posterChatBtn}`}
                                            onClick={() => handleChat(item.postedBy?._id)}
                                            disabled={!item.postedBy?._id}
                                        >
                                            Chat with Poster
                                        </button>
                                    </div>

                                    {item.status === "active" && (
                                        <button
                                            className={styles.resolveBtn}
                                            onClick={() => handleResolve(item._id)}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? "Processing..." : "Mark Resolved"}
                                        </button>
                                    )}

                                    {item.status === "In Process" && (
                                        <>
                                            <button
                                                className={styles.approveBtn}
                                                onClick={() => handleApproveClaim(item._id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className={styles.rejectBtn}
                                                onClick={() => handleRejectClaim(item._id)}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFoundItems;
