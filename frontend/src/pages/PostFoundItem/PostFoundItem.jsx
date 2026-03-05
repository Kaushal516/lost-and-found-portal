import { useState, useRef } from "react";
import axios from "axios";
import styles from "./PostFoundItem.module.css";
import { useLanguage } from "../../context/LanguageContext";

const PostFoundItem = () => {
  const { t } = useLanguage();
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
        showPopup(t('common.maxImgError'), "error");
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
      showPopup(t('common.required'), "error");
      return;
    }

    // 🚨 Mandatory image check
    if (images.length < 1) {
      showPopup(t('common.minImgError'), "error");
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

      showPopup(t('common.success'));

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setDateFound("");
      setImages([]);
    } catch (error) {
      showPopup(
        error.response?.data?.message || t('post.failedToPostFound') || "Failed to post found item",
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
        <h2>{t('post.foundTitle')}</h2>

        <label htmlFor="title">
          {t('post.itemTitle')} <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder={t('post.itemTitlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">
          {t('post.category')} <span style={{ color: "red" }}>*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t('post.selectCategory')}</option>
          {["Electronics", "Documents", "Clothing", "Accessories", "Other"].map(cat => (
            <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
          ))}
        </select>

        <label htmlFor="description">
          {t('post.description')} <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="description"
          placeholder={t('post.descPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="location">
          {t('post.location')} <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="location"
          type="text"
          placeholder={t('post.foundLocPlaceholder')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor="dateFound">
          {t('post.dateFound')} <span style={{ color: "red" }}>*</span>
        </label>
        <input
          id="dateFound"
          type="date"
          value={dateFound}
          onChange={(e) => setDateFound(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <label className={styles.uploadLabel}>
          {t('post.addPhotos')} <strong>{t('post.minPhotos')}</strong>
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
          <p>{t('post.uploadPhotos')}</p>

          <button
            type="button"
            className={styles.chooseBtn}
            onClick={() => fileInputRef.current.click()}
          >
            {t('post.choosePhotos')}
          </button>

          <small>{t('post.supportText')}</small>

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
          {loading ? t('post.posting') : t('post.submitFound')}
        </button>
      </form>
    </div>
  );
};

export default PostFoundItem;
