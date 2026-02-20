import { useState, useRef } from "react";
import axios from "axios";
import styles from "./PostFoundItem.module.css";

const PostFoundItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef(null);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  // 📸 IMAGE HANDLER (max 5)
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setImages((prev) => {
      const combined = [...prev, ...selectedFiles];
      if (combined.length > 5) {
        showPopup("Maximum 5 images allowed", "error");
        return prev;
      }
      return combined;
    });

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !location || !dateFound) {
      showPopup("Please fill all required fields", "error");
      return;
    }

    // 🚨 Mandatory image check
    if (images.length < 1) {
      showPopup("At least one image is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("dateFound", dateFound);
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/found", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showPopup("Found item posted successfully");

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setDateFound("");
      setImages([]);
    } catch (error) {
      showPopup(
        error.response?.data?.message || "Failed to post found item",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {popup.show && (
        <div className={`${styles.popup} ${styles[popup.type]}`}>
          {popup.message}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Post Found Item</h2>

        <label htmlFor="title">
          Item Title <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Black Wallet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">
          Category <span style={{ color: "red" }}>*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="description">
          Description <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="description"
          placeholder="Provide detailed description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="location">
          Found Location <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="location"
          type="text"
          placeholder="Where was it found?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="dateFound">
          Date Found <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="dateFound"
          type="date"
          value={dateFound}
          onChange={(e) => setDateFound(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <label className={styles.uploadLabel}>
          Add Photos <strong>(At least 1 required)</strong>
        </label>

        {images.length > 0 && (
          <div className={styles.previewGrid}>
            {images.map((file, index) => (
              <div key={index} className={styles.previewItem}>
                <img src={URL.createObjectURL(file)} alt="preview" />
                <button type="button" onClick={() => removeImage(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.uploadBox}>
          <div className={styles.cameraIcon}></div>
          <p>Upload photos to verify the found item</p>

          <button
            type="button"
            className={styles.chooseBtn}
            onClick={() => fileInputRef.current.click()}
          >
            Choose Photos
          </button>

          <small>Supports JPG, PNG, WEBP (Max 5 images)</small>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Submit Found Item"}
        </button>
      </form>
    </div>
  );
};

export default PostFoundItem;
