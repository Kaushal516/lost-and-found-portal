import { useEffect, useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import LostItemCard from "../../components/ItemCard/LostItemCard";
import styles from "./LostPublic.module.css";
import { Search, Filter, Calendar } from "lucide-react";

const LostPublic = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // Newest, Oldest, Title A-Z

  const availableCategories = ["Electronics", "Documents", "Clothing", "Accessories", "Other"];

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



  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesQuery = query === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = category === "" || item.category === category;

    const itemDate = new Date(item.dateLost);
    // Reset time for accurate day comparison
    itemDate.setHours(0, 0, 0, 0);

    let matchesDate = true;
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (itemDate < from) matchesDate = false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(0, 0, 0, 0);
      if (itemDate > to) matchesDate = false;
    }

    const matchesStatus = statusFilter === "" || (item.status || "active") === statusFilter;

    return matchesQuery && matchesCategory && matchesDate && matchesStatus;
  });

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
    setSortBy("newest");
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.heading}>Lost Items Reported</h2>
        <div className={styles.resultCount}>
          {sortedItems.length} {sortedItems.length === 1 ? 'result' : 'results'} found
        </div>
      </div>

      <div className={styles.layout}>
        {/* ADVANCED FILTER SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3><Filter size={18} /> Filters</h3>
            <button className={styles.resetBtn} onClick={resetFilters}>Reset All</button>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search Term</label>
            <div className={styles.searchInputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.sidebarInput}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sidebarSelect}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.sidebarSelect}
            >
              <option value="">All Statuses</option>
              <option value="active">Available</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Categories</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.sidebarSelect}
            >
              <option value="">All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Calendar size={14} /> Date Lost Range</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={styles.sidebarDate}
                title="From Date"
              />
              <span className={styles.dateSeparator}>to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={styles.sidebarDate}
                title="To Date"
              />
            </div>
          </div>


        </aside>

        {/* RESULTS AREA */}
        <main className={styles.mainContent}>
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
          ) : sortedItems.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No items found</h3>
              <p>Try adjusting your search filters.</p>
              <button className={styles.resetBtnLg} onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {sortedItems.map(item => (
                <LostItemCard key={item._id} item={item} currentUserId={user?.id} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LostPublic;
