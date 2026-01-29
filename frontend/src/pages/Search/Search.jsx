import { useState } from "react";
import styles from "./Search.module.css";
import api from "../../utils/api";
import SearchResults from "./SearchResults";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter an item name");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("q", query);

      if (category) params.append("category", category);
      if (date) params.append("date", date);

      const res = await api.get(`/search/found?${params.toString()}`);
      setResults(res.data);
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchPage}>
      <h2>Search Found Items</h2>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search item name (e.g. wallet)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {loading && (
        <div className={styles.loading}>
          <span>Searching...</span>
        </div>
      )}

      {!loading && <SearchResults results={results} />}
    </div>
  );
};

export default Search;
