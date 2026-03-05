import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [role, setRole] = useState("user"); // user | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t('auth.reqError'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint =
        role === "admin" ? "/admin/login" : "/users/login";

      const res = await api.post(endpoint, {
        email,
        password
      });

      // 🔐 THIS IS WHERE TOKEN IS STORED
      localStorage.setItem("token", res.data.token);

      // 🔀 Redirect based on role
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/search");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || t('common.error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <h2>{t('auth.loginTitle')}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Role Selection */}
          <div className={styles.roleSwitch}>
            <button
              type="button"
              className={role === "user" ? styles.active : ""}
              onClick={() => setRole("user")}
            >
              {t('auth.user')}
            </button>

            <button
              type="button"
              className={role === "admin" ? `${styles.active} ${styles.adminActive}` : ""}
              onClick={() => setRole("admin")}
            >
              {t('auth.admin')}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.emailLabel')}</label>
            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t('auth.passwordLabel')}</label>
            <input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
          </button>

          {role === "user" && (
            <div className={styles.footerLinks}>
              <p className={styles.forgotPassword} onClick={() => navigate("/forgot-password")}>
                {t('auth.forgotPassword')}
              </p>
              <p className={styles.noAccount}>
                {t('auth.noAccount')} <span onClick={() => navigate("/register")}>{t('auth.registerTitle')}</span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
