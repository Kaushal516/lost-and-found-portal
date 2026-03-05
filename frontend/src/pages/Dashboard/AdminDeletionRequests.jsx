import { useState, useEffect } from "react";
import api from "../../utils/api";
import styles from "./AdminDeletionRequests.module.css";
import { Trash2, User, Mail, Phone, Calendar, AlertCircle, CheckCircle } from "lucide-react";

const AdminDeletionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/admin/deletion-requests");
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("CRITICAL: This will permanently delete the user and ALL their posted items. This cannot be undone. Proceed?")) return;

        setActioning(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            setRequests(prev => prev.filter(r => r.user._id !== userId));
            alert("User deleted permanently.");
        } catch (err) {
            alert(err.response?.data?.message || "Deletion failed");
        } finally {
            setActioning(null);
        }
    };

    if (loading) return <div className={styles.loading}>Loading requests...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header + " glass"}>
                <Trash2 size={32} color="var(--danger)" />
                <div>
                    <h1>Account Deletion Requests</h1>
                    <p>Manage users who have requested permanent account removal.</p>
                </div>
            </div>

            <div className={styles.requestsGrid}>
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request._id} className={styles.requestCard + " glass"}>
                            <div className={styles.userInfo}>
                                <div className={styles.avatar}>
                                    <User size={32} />
                                </div>
                                <div className={styles.details}>
                                    <h3>{request.user.firstName} {request.user.lastName}</h3>
                                    <p>@{request.user.username}</p>
                                </div>
                            </div>

                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <Mail size={16} /> {request.user.email}
                                </div>
                                <div className={styles.contactItem}>
                                    <Phone size={16} /> {request.user.phoneNumber}
                                </div>
                                <div className={styles.contactItem}>
                                    <Calendar size={16} /> Requested on {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className={styles.reasonBox}>
                                <strong>Reason:</strong>
                                <p>{request.reason}</p>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDeleteUser(request.user._id)}
                                    disabled={actioning === request.user._id}
                                >
                                    <Trash2 size={18} />
                                    {actioning === request.user._id ? "Deleting..." : "Permanently Delete Account"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState + " glass"}>
                        <CheckCircle size={48} color="var(--success)" />
                        <h2>No Pending Requests</h2>
                        <p>All deletion requests have been handled.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDeletionRequests;
