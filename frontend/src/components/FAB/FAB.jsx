import { useState } from "react";
import { Plus, Megaphone, Search, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./FAB.module.css";
import useAuth from "../../hooks/useAuth";

const FAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Hide FAB on admin routes
    const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/dashboard";

    if (isAdminRoute) return null;

    const handleAction = (path) => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            navigate(path);
        }
        setIsOpen(false);
    };

    return (
        <div className={styles.fabContainer}>
            {isOpen && (
                <div className={styles.menu}>
                    <button
                        className={styles.menuItem}
                        onClick={() => handleAction("/found/new")}
                        style={{ "--delay": "0.1s" }}
                    >
                        <span>Post Found</span>
                        <div className={`${styles.iconCircle} ${styles.found}`}>
                            <Search size={18} />
                        </div>
                    </button>
                    <button
                        className={styles.menuItem}
                        onClick={() => handleAction("/lost/new")}
                        style={{ "--delay": "0.05s" }}
                    >
                        <span>Report Lost</span>
                        <div className={`${styles.iconCircle} ${styles.lost}`}>
                            <Megaphone size={18} />
                        </div>
                    </button>
                </div>
            )}
            <button
                className={`${styles.mainBtn} ${isOpen ? styles.active : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Quick Actions"
            >
                {isOpen ? <X size={24} /> : <Plus size={24} />}
            </button>
        </div>
    );
};

export default FAB;
