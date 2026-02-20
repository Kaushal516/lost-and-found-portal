import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // No longer returning null!

  return (
    <nav className={styles.navbar}>
      <div
        className={styles.logoContainer}
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Lost & Found" className={styles.logoImg} />
      </div>

      <div className={styles.links}>
        {/* Public Links */}
        {!isAuthenticated && (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Home</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Register</NavLink>
          </>
        )}

        {/* Authenticated Links */}
        {isAuthenticated && (
          <>
            {/* Admin Only */}
            {isAdmin && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Dashboard</NavLink>
                <NavLink to="/admin/claims" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Claims</NavLink>
                <NavLink to="/admin/lost-items" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Lost Reports</NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Users</NavLink>
              </>
            )}

            {/* Common Auth Links */}
            <NavLink to="/search" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Search</NavLink>

            <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Chat</NavLink>

            {/* User Only */}
            {!isAdmin && (
              <>
                <NavLink to="/lost/new" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Report Lost</NavLink>
                <NavLink to="/found/new" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Post Found</NavLink>
                <NavLink to="/my-posts" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>My Posts</NavLink>
              </>
            )}

            <button onClick={handleLogout} className={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
