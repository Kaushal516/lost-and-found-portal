import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import styles from "./UsersList.module.css";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/admin/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChat = async (userId) => {
        try {
            navigate(`/chat?type=direct&user=${userId}`);
        } catch (err) {
            console.error("Failed to start chat", err);
            alert("Failed to start chat");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Registered Users</h2>
                <button onClick={() => navigate("/dashboard")} className={styles.backBtn}>
                    Back to Dashboard
                </button>
            </div>

            {loading ? (
                <div className={styles.grid}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="glass" style={{ padding: "1.75rem", borderRadius: "20px" }}>
                            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                                <div className="skeleton" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton skeletonTitle" style={{ width: "80%", height: "1.2rem" }} />
                                    <div className="skeleton skeletonText" style={{ width: "40%", height: "0.8rem" }} />
                                </div>
                            </div>
                            <div className="skeleton skeletonText" />
                            <div className="skeleton skeletonText" style={{ width: "70%" }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.grid}>
                    {users.map((user) => (
                        <div key={user._id} className={styles.card}>
                            <div className={styles.userHeader}>
                                <div className={styles.avatar}>
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                                    <span className={styles.userHandle}>@{user.username}</span>
                                </div>
                            </div>

                            <div className={styles.details}>
                                <div className={styles.detailItem}>
                                    <strong>Email</strong>
                                    <span>{user.email}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Phone</strong>
                                    <span>{user.phoneNumber || "N/A"}</span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleChat(user._id)}
                                    className={styles.chatBtn}
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersList;
