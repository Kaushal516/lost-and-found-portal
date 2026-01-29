import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LostNew.module.css";
import api from "../../utils/api";

const LostNew = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateLost: "",
    images: []
  });

  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addImage = () => {
    if (!imageInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput.trim()]
    }));
    setImageInput("");
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/lost", formData);
      navigate("/search");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post lost item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Report Lost Item</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="title"
          placeholder="Item name (e.g. Black Wallet)"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          <option value="Accessories">Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Others">Others</option>
        </select>

        <input
          name="location"
          placeholder="Last seen location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dateLost"
          value={formData.dateLost}
          onChange={handleChange}
        />

        {/* Optional images */}
        <div className={styles.imageInput}>
          <input
            placeholder="Image URL (optional)"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <button type="button" onClick={addImage}>
            Add
          </button>
        </div>

        {formData.images.length > 0 && (
          <ul className={styles.imageList}>
            {formData.images.map((img, i) => (
              <li key={i}>
                {img}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Lost Report"}
        </button>
      </form>
    </div>
  );
};

export default LostNew;
