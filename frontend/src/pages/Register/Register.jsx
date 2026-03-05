import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.matchError'));
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/register", formData);

      setSuccess(t('auth.successReg'));

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err);
      setError(
        err.response?.data?.message || err.message || t('common.error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <h2>{t('auth.registerTitle')}</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>{t('auth.firstName')}</label>
            <input
              name="firstName"
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.lastName')}</label>
            <input
              name="lastName"
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('profile.username')}</label>
            <input
              name="username"
              placeholder="letters, numbers, _ (no spaces)"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={4}
              maxLength={20}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.emailLabel')}</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.phone')}</label>
            <input
              name="phoneNumber"
              placeholder="10-digit mobile number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              maxLength={10}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.passwordLabel')}</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? t('auth.loggingUp') : t('auth.registerBtn')}
          </button>

          <p className={styles.haveAccount}>
            {t('auth.haveAccount')} <span onClick={() => navigate("/login")}>{t('auth.loginTitle')}</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
