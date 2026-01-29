import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import api from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // user | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
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
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Role Selection */}
        <div className={styles.roleSwitch}>
          <button
            type="button"
            className={role === "user" ? styles.active : ""}
            onClick={() => setRole("user")}
          >
            User
          </button>

          <button
            type="button"
            className={role === "admin" ? styles.active : ""}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
