import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, MapPin, Tag } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./LiveActivityFeed.module.css";

const LiveActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/public/recent");
                setActivities(response.data);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
        const interval = setInterval(fetchActivity, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading && activities.length === 0) {
        return <div className={styles.loading}>{t('common.loading')}</div>;
    }

    return (
        <div className={styles.feedContainer}>
            <div className={styles.header}>
                <Clock size={20} className={styles.pulseIcon} />
                <h3>{t('home.activityFeed')}</h3>
            </div>
            <div className={styles.activityList}>
                {activities.map((item, index) => (
                    <div key={item._id || index} className={styles.activityItem} style={{ "--delay": `${index * 0.1}s` }}>
                        <div className={`${styles.typeBadge} ${item.type === 'lost' ? styles.lost : styles.found}`}>
                            {item.type === 'lost' ? t('nav.lostReports').split(' ')[0].toUpperCase() : t('nav.found').split(' ')[0].toUpperCase()}
                        </div>
                        <div className={styles.content}>
                            <h4 className={styles.itemTitle}>{item.title}</h4>
                            <div className={styles.metadata}>
                                <span><Tag size={12} /> {t(`categories.${item.category}`)}</span>
                                <span><MapPin size={12} /> {item.location}</span>
                            </div>
                        </div>
                        <div className={styles.timeTag}>
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {activities.length === 0 && <p className={styles.empty}>{t('home.noActivity')}</p>}
            </div>
        </div>
    );
};

export default LiveActivityFeed;
