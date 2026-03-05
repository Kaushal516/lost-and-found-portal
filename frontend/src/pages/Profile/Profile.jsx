import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";
import { User, Mail, Phone, Calendar, Camera, Package, Save, Settings, ShieldCheck, Eye, Trash2, AlertTriangle } from "lucide-react";
import LostPosts from "../MyPosts/LostPosts";
import FoundPosts from "../MyPosts/FoundPosts";

const Profile = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("overview");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [deletionPending, setDeletionPending] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        profileImg: ""
    });

    const [settingsData, setSettingsData] = useState({
        emailNotifications: true,
        publicProfile: true,
        defaultView: "grid",
        defaultLanguage: "en",
        theme: "light"
    });

    const [myLostItems, setMyLostItems] = useState([]);
    const [myFoundItems, setMyFoundItems] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [profileRes, lostRes, foundRes] = await Promise.all([
                    api.get("/users/profile"),
                    api.get("/my-posts/lost"),
                    api.get("/my-posts/found")
                ]);

                setUserData(profileRes.data);
                setDeletionPending(profileRes.data.deletionPending);
                setFormData({
                    firstName: profileRes.data.firstName,
                    lastName: profileRes.data.lastName,
                    username: profileRes.data.username,
                    profileImg: profileRes.data.profileImg || ""
                });

                if (profileRes.data.settings) {
                    setSettingsData(profileRes.data.settings);
                }

                setMyLostItems(lostRes.data);
                setMyFoundItems(foundRes.data);
            } catch (err) {
                console.error("Data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put("/users/profile", formData);
            setUserData(res.data);
            setEditMode(false);
        } catch (err) {
            alert(err.response?.data?.message || t('common.error'));
        }
    };

    const handleSettingsUpdate = async (newSettings) => {
        try {
            const updatedSettings = { ...settingsData, ...newSettings };
            const res = await api.put("/users/profile", { settings: updatedSettings });
            setSettingsData(res.data.settings);
            setUserData(res.data);
        } catch (err) {
            console.error("Settings update failed", err);
        }
    };

    const handleDeletionRequest = async () => {
        if (!window.confirm("Are you sure you want to request account deletion? This action cannot be easily undone once completed by an admin.")) return;

        try {
            await api.post("/users/profile/deletion-request", { reason: "User requested via profile" });
            setDeletionPending(true);
            alert("Deletion request submitted to administrators.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit request");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                await api.put("/users/profile", { ...formData, profileImg: base64String });
                setFormData(prev => ({ ...prev, profileImg: base64String }));
                setUserData(prev => ({ ...prev, profileImg: base64String }));
            } catch (err) {
                console.error("Image update failed", err);
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) return <div className={styles.loading}>{t('common.loading')}</div>;
    if (!userData) return <div className={styles.loading}>Error loading profile. Please try logging out and back in.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader + " glass"}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarLarge}>
                        {userData.profileImg ? (
                            <img src={userData.profileImg} alt="Profile" />
                        ) : (
                            <User size={64} className={styles.defaultIcon} />
                        )}
                    </div>
                    <label className={styles.uploadButton}>
                        <Camera size={18} />
                        {t('profile.changePicture')}
                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
                <div className={styles.headerInfo}>
                    <h1>{userData.firstName} {userData.lastName}</h1>
                    <p>@{userData.username}</p>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                <aside className={styles.sidebar + " glass"}>
                    <button
                        className={activeTab === 'overview' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        <User size={18} /> {t('profile.overview')}
                    </button>
                    <button
                        className={activeTab === 'activity' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('activity')}
                    >
                        <Package size={18} /> {t('profile.myActivity')}
                    </button>
                    <button
                        className={activeTab === 'settings' ? styles.activeTab : ''}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} /> {t('settings.title')}
                    </button>
                </aside>

                <main className={styles.mainContent + " glass"}>
                    {activeTab === 'overview' && (
                        <div className={styles.tabPane}>
                            <div className={styles.paneHeader}>
                                <h2>{t('profile.infoTitle')}</h2>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    {editMode ? t('common.cancel') : t('profile.editProfile')}
                                </button>
                            </div>

                            {editMode ? (
                                <form onSubmit={handleUpdateProfile} className={styles.form}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>{t('profile.firstName')}</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>{t('profile.lastName')}</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('profile.username')}</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className={styles.saveBtn}>
                                        <Save size={18} /> {t('common.save')}
                                    </button>
                                </form>
                            ) : (
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <Mail size={18} />
                                        <div>
                                            <label>{t('profile.email')}</label>
                                            <p>{userData.email}</p>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Phone size={18} />
                                        <div>
                                            <label>{t('profile.phone')}</label>
                                            <p>{userData.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Calendar size={18} />
                                        <div>
                                            <label>{t('profile.memberSince')}</label>
                                            <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className={styles.tabPane}>
                            <LostPosts items={myLostItems} />
                            <hr className={styles.separator} />
                            <FoundPosts items={myFoundItems} />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className={styles.tabPane}>
                            <div className={styles.settingsSection}>
                                <h3><ShieldCheck size={20} /> {t('settings.notifications')}</h3>
                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <label>{t('settings.emailAlerts')}</label>
                                        <p>{t('settings.emailAlertsDesc')}</p>
                                    </div>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={settingsData.emailNotifications}
                                            onChange={(e) => handleSettingsUpdate({ emailNotifications: e.target.checked })}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.settingsSection}>
                                <h3><Eye size={20} /> {t('settings.privacy')}</h3>
                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <label>{t('settings.publicProfile')}</label>
                                        <p>{t('settings.publicProfileDesc')}</p>
                                    </div>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={settingsData.publicProfile}
                                            onChange={(e) => handleSettingsUpdate({ publicProfile: e.target.checked })}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.settingsSection}>
                                <h3><Settings size={20} /> {t('settings.preferences')}</h3>
                                <div className={styles.settingsGrid}>
                                    <div className={styles.formGroup}>
                                        <label>{t('settings.defaultView')}</label>
                                        <select
                                            value={settingsData.defaultView}
                                            onChange={(e) => handleSettingsUpdate({ defaultView: e.target.value })}
                                            className={styles.select}
                                        >
                                            <option value="grid">Grid View</option>
                                            <option value="list">List View</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('settings.defaultLanguage')}</label>
                                        <select
                                            value={settingsData.defaultLanguage}
                                            onChange={(e) => handleSettingsUpdate({ defaultLanguage: e.target.value })}
                                            className={styles.select}
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">Hindi</option>
                                            <option value="bn">Bengali</option>
                                            <option value="te">Telugu</option>
                                            <option value="mr">Marathi</option>
                                            <option value="ta">Tamil</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>{t('settings.theme')}</label>
                                        <select
                                            value={settingsData.theme}
                                            onChange={(e) => handleSettingsUpdate({ theme: e.target.value })}
                                            className={styles.select}
                                        >
                                            <option value="light">Light Mode</option>
                                            <option value="dark">Dark Mode</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.settingsSection + " " + styles.dangerZone}>
                                <div className={styles.settingItem}>
                                    <div className={styles.settingInfo}>
                                        <label>{t('settings.deleteAccount')}</label>
                                        <p>{t('settings.deleteAccountDesc')}</p>
                                    </div>
                                    {deletionPending ? (
                                        <div className={styles.pendingStatus}>
                                            <AlertTriangle size={18} />
                                            <span>{t('profile.deletionPending')}</span>
                                        </div>
                                    ) : (
                                        <button className={styles.deleteBtn} onClick={handleDeletionRequest}>
                                            {t('profile.requestDeletion')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
