import { useEffect, useState } from "react";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";
import LostItemCard from "../../components/ItemCard/LostItemCard";
import styles from "./LostPublic.module.css";
import { Search, Filter, Calendar, LayoutGrid, List } from "lucide-react";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useLanguage } from "../../context/LanguageContext";

const LostPublic = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

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
        <div>
          <h2 className={styles.heading}>{t('search.lostReportsTitle')}</h2>
          <div className={styles.resultCount}>
            {sortedItems.length} {t('search.results')}
          </div>
        </div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleActive : ''}`}
            onClick={() => setViewMode('grid')}
            title={t('search.grid')}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleActive : ''}`}
            onClick={() => setViewMode('list')}
            title={t('search.list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ADVANCED FILTER SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3><Filter size={18} /> {t('search.filters')}</h3>
            <button className={styles.resetBtn} onClick={resetFilters}>{t('search.reset')}</button>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search.searchTerm')}</label>
            <div className={styles.searchInputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t('search.keywords')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.sidebarInput}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search.sortBy')}</label>
            <CustomSelect
              value={sortBy}
              options={[
                { value: "newest", label: t('search.newest') },
                { value: "oldest", label: t('search.oldest') },
                { value: "title-asc", label: t('search.titleAsc') },
                { value: "title-desc", label: t('search.titleDesc') }
              ]}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search.status')}</label>
            <CustomSelect
              value={statusFilter}
              options={[
                { value: "", label: t('search.allStatus') },
                { value: "active", label: t('status.active') },
                { value: "resolved", label: t('status.resolved') }
              ]}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{t('search.category')}</label>
            <CustomSelect
              value={category}
              options={[
                { value: "", label: t('search.allCategories') },
                { value: "Electronics", label: t('categories.Electronics') },
                { value: "Documents", label: t('categories.Documents') },
                { value: "Clothing", label: t('categories.Clothing') },
                { value: "Accessories", label: t('categories.Accessories') },
                { value: "Personal Items", label: t('categories.Personal Items') },
                { value: "Pets", label: t('categories.Pets') },
                { value: "Other", label: t('categories.Other') }
              ]}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}><Calendar size={14} /> {t('search.dateRange')}</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={styles.sidebarDate}
                title={t('search.from')}
              />
              <span className={styles.dateSeparator}>{t('search.to')}</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={styles.sidebarDate}
                title={t('search.to')}
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
              <h3>{t('search.noResults')}</h3>
              <p>{t('search.placeholder')}</p>
              <button className={styles.resetBtnLg} onClick={resetFilters}>{t('search.reset')}</button>
            </div>
          ) : (
            <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : ''}`}>
              {sortedItems.map(item => (
                <LostItemCard key={item._id} item={item} currentUserId={user?.id} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LostPublic;
