import { useState, useRef } from "react";
import axios from "axios";
import styles from "./PostLostItem.module.css";

const PostLostItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const fileInputRef = useRef(null);


  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

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

    // allow re-selecting same file
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !location || !dateLost) {
      showPopup("Please fill all required fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("dateLost", dateLost);
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/lost", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });



      showPopup("Lost item posted successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setDateLost("");
      setImages([]);
    } catch (error) {
      showPopup(error.response?.data?.message || "Failed to post lost item", "error");
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
        <h2>Report Lost Item</h2>

        <label htmlFor="title">
          Item Title<span style={{ color: "red" }}> *</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. iPhone 13 Pro"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">
          Category<span style={{ color: "red" }}> *</span>
        </label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="description">
          Description<span style={{ color: "red" }}> *</span>
        </label>
        <textarea
          id="description"
          placeholder="Provide detailed description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="location">
          Last Seen Location<span style={{ color: "red" }}> *</span>
        </label>
        <input
          id="location"
          type="text"
          placeholder="Where was it lost?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="dateLost">
          Date Lost<span style={{ color: "red" }}> *</span>
        </label>
        <input
          id="dateLost"
          type="date"
          value={dateLost}
          onChange={(e) => setDateLost(e.target.value)}
        />

        {/* ✅ IMAGE UPLOAD SECTION (MATCHES YOUR UI) */}
        <label className={styles.uploadLabel}>
          Add Photo (Optional)
        </label>

        {/* Preview thumbnails */}
        {images.length > 0 && (
          <div className={styles.previewGrid}>
            {images.map((file, index) => (
              <div key={index} className={styles.previewItem}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                />
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

        <div className={styles.uploadBox}>
          <div className={styles.cameraIcon}></div>
          <p>Upload photos to help others identify the item</p>

          <button
            type="button"
            className={styles.chooseBtn}
            onClick={() => fileInputRef.current.click()}
          >
            Choose Photos
          </button>

          <small>
            Supports JPG, PNG, WEBP (Max 5 images)
          </small>

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
          {loading ? "Posting..." : "Submit Lost Item"}
        </button>

      </form>
    </div>
  );
};

export default PostLostItem;
