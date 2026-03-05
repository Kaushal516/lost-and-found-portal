import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import megaphoneIcon from "../../assets/report_icon_new.png";
import searchIcon from "../../assets/search_icon_new.png";
import chatIcon from "../../assets/secure_icon_new.png";
import LiveActivityFeed from "../../components/LiveActivityFeed/LiveActivityFeed";
import { useLanguage } from "../../context/LanguageContext";

const Home = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        {t('home.heroTitle')}
                    </h1>
                    <p className={styles.subtitle}>
                        {t('home.heroSubtitle')}
                    </p>
                    <div className={styles.ctaGroup}>
                        <button onClick={() => navigate("/login")} className={styles.primaryBtn}>
                            {t('nav.login')}
                        </button>
                        <button onClick={() => navigate("/search")} className={styles.secondaryBtn}>
                            {t('home.viewFound')}
                        </button>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <LiveActivityFeed />
                </div>
            </section>

            {/* How it Works */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>{t('home.howItWorks')}</h2>
                <div className={styles.grid}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={megaphoneIcon} alt="Report" className={styles.featureIcon} />
                        </div>
                        <h3>{t('home.reportTitle')}</h3>
                        <p>{t('home.reportDesc')}</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={searchIcon} alt="Search" className={styles.featureIcon} />
                        </div>
                        <h3>{t('home.searchTitle')}</h3>
                        <p>{t('home.searchDesc')}</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={chatIcon} alt="Connect" className={styles.featureIcon} />
                        </div>
                        <h3>{t('home.connectTitle')}</h3>
                        <p>{t('home.connectDesc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
