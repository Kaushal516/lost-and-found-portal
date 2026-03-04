import { useState, useEffect, useRef } from "react";
import styles from "./NotificationBell.module.css";
import { Bell, Check, Info } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import socket from "../../socket";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toast, setToast] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { user, token } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch initial notifications
    useEffect(() => {
        if (!token) return;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setNotifications(res.data.data);
                    setUnreadCount(res.data.data.filter(n => !n.read).length);
                }
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
    }, [token]);

    // Socket setup
    useEffect(() => {
        if (!user || !token) return;

        socket.emit("setup", user);

        const handleNewNotification = (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            setToast(newNotif);
            setTimeout(() => setToast(null), 5000);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [user, token]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read", error);
        }
    };

    const handleNotificationClick = (notif) => {
        if (!notif.read) markAsRead(notif._id, { stopPropagation: () => { } });
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.bellContainer} ref={dropdownRef}>
            <button className={styles.bellButton} onClick={toggleDropdown} aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className={styles.markAllBtn} onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <div className={styles.empty}>
                                <Info size={24} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif._id}
                                    className={`${styles.item} ${notif.read ? styles.read : styles.unread}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <div className={styles.content}>
                                        <p className={styles.message}>{notif.message}</p>
                                        <span className={styles.time}>
                                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {!notif.read && (
                                        <button
                                            className={styles.checkBtn}
                                            onClick={(e) => markAsRead(notif._id, e)}
                                            title="Mark as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Basic Toast Notification */}
            {toast && (
                <div className={styles.toast} onClick={() => handleNotificationClick(toast)}>
                    <div className={styles.toastContent}>
                        <strong>New Notification</strong>
                        <p>{toast.message}</p>
                    </div>
                    <button className={styles.toastClose} onClick={(e) => { e.stopPropagation(); setToast(null); }}>×</button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
