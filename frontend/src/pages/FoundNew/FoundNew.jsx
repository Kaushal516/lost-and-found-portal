import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FoundNew.module.css";
import api from "../../utils/api";

const FoundNew = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateFound: "",
    images: []
  });

  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addImage = () => {
    if (!imageInput.trim()) return;

    if (formData.images.length >= 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput.trim()]
    }));

    setImageInput("");
    setError("");
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

    if (formData.images.length < 1) {
      setError("At least one image is required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/found", formData);
      navigate("/search");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to post found item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Post Found Item</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="title"
          placeholder="Item name (e.g. Black Wallet)"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
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
          placeholder="Found location"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dateFound"
          value={formData.dateFound}
          onChange={handleChange}
        />

        {/* Image input */}
        <div className={styles.imageInput}>
          <input
            placeholder="Image URL (required)"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
          />
          <button type="button" onClick={addImage}>
            Add
          </button>
        </div>

        {/* Image previews */}
        {formData.images.length > 0 && (
          <div className={styles.previewGrid}>
            {formData.images.map((img, index) => (
              <div key={index} className={styles.previewCard}>
                <img src={img} alt="preview" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Found Item"}
        </button>
      </form>
    </div>
  );
};

export default FoundNew;
