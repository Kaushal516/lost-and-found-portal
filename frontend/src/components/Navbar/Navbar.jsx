import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  Moon,
  Sun,
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ClipboardList,
  FileWarning,
  Users,
  Search,
  MessageCircle,
  FileText,
  PlusCircle,
  LogOut,
  Languages,
  User,
  Trash2
} from "lucide-react";
import NotificationBell from "../NotificationBell/NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, availableLanguages, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
            <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <Home size={18} />
              <span>{t('nav.home')}</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <LogIn size={18} />
              <span>{t('nav.login')}</span>
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <UserPlus size={18} />
              <span>{t('nav.signup')}</span>
            </NavLink>
          </>
        )}

        {/* Authenticated Links */}
        {isAuthenticated && (
          <>
            {/* Admin Only */}
            {isAdmin && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <LayoutDashboard size={18} />
                  <span>{t('nav.dashboard')}</span>
                </NavLink>
                <NavLink to="/admin/claims" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <ClipboardList size={18} />
                  <span>{t('nav.claims')}</span>
                </NavLink>
                <NavLink to="/admin/lost-items" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <FileWarning size={18} />
                  <span>{t('nav.lostReports')}</span>
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <Users size={18} />
                  <span>{t('nav.users')}</span>
                </NavLink>
                <NavLink to="/admin/deletion-requests" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <Trash2 size={18} />
                  <span>{t('nav.deletionRequests')}</span>
                </NavLink>
              </>
            )}

            {/* Common Auth Links */}
            <NavLink to="/search" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <Search size={18} />
              <span>{t('nav.search')}</span>
            </NavLink>

            <NavLink to="/lost" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <ClipboardList size={18} />
              <span>{t('nav.lost')}</span>
            </NavLink>

            <NavLink to="/chat" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
              <MessageCircle size={18} />
              <span>{t('nav.chat')}</span>
            </NavLink>

            {/* User Only Actions (Report) */}
            {!isAdmin && (
              <>
                <NavLink to="/lost/new" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <PlusCircle size={18} />
                  <span>{t('nav.reportLost')}</span>
                </NavLink>
                <NavLink to="/found/new" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                  <PlusCircle size={18} />
                  <span>{t('nav.postFound')}</span>
                </NavLink>
              </>
            )}

            {!isAdmin && <NotificationBell />}
          </>
        )}
        {!isAdmin && (
          <div className={styles.langWrapper} ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`${styles.themeToggle} ${showLangMenu ? styles.active : ''}`}
              title="Switch Language"
            >
              <Languages size={20} />
              <span className={styles.langLabel}>{language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className={`${styles.langDropdown} glass`}>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`${styles.langOption} ${language === lang.code ? styles.langActive : ''}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Dark Mode">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {isAuthenticated && (
          <>
            {!isAdmin && (
              <div
                className={styles.profileCircle}
                onClick={() => navigate("/profile")}
                title={t('nav.profile')}
              >
                {user?.profileImg ? (
                  <img src={user.profileImg} alt="Profile" className={styles.navAvatar} />
                ) : (
                  <User size={20} />
                )}
              </div>
            )}
            <button onClick={handleLogout} className={styles.logoutLink} title={t('nav.logout')}>
              <LogOut size={20} />
              <span>{t('nav.logout')}</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
