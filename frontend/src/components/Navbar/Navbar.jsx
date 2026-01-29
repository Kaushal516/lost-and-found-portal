import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hide navbar if not logged in
  if (!isAuthenticated) return null;

  return (
    <nav className={styles.navbar}>
      <h3 className={styles.logo}>Lost & Found</h3>

      <div className={styles.links}>
        {/* Admin Links */}
        {isAdmin && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/resolve">Resolve</NavLink>
          </>
        )}

        {/* User & Admin */}
        <NavLink to="/search">Found Items</NavLink>
        <NavLink to="/lost-items">Lost Items</NavLink>
        <NavLink to="/chat">Chat</NavLink>

        {/* User-only (will be implemented later) */}
        {!isAdmin && (
          <>
            <NavLink to="/lost/new">Report Lost</NavLink>
            <NavLink to="/found/new">Post Found</NavLink>
          </>
        )}

        {!isAdmin && <NavLink to="/my-posts">My Posts</NavLink>}

        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
