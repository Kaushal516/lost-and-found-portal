import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import megaphoneIcon from "../../assets/report_icon_new.png";
import searchIcon from "../../assets/search_icon_new.png";
import chatIcon from "../../assets/secure_icon_new.png";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        Recover What’s <span className={styles.highlight}>Lost</span>.<br />
                        Return What’s <span className={styles.highlight}>Found</span>.
                    </h1>
                    <p className={styles.subtitle}>
                        A secure community portal to reconnect owners with their lost belongings.
                        Simple, fast, and trusted by thousands.
                    </p>
                    <div className={styles.ctaGroup}>
                        <button onClick={() => navigate("/login")} className={styles.primaryBtn}>
                            Get Started
                        </button>
                        <button onClick={() => navigate("/search")} className={styles.secondaryBtn}>
                            Browse Found Items
                        </button>
                    </div>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.circle}></div>
                    <div className={styles.cardPreview}>
                        <div className={styles.fakeCard}>
                            <span>Lost Keys</span>
                            <div className={styles.fakeTag}>🔑</div>
                        </div>
                        <div className={`${styles.fakeCard} ${styles.card2}`}>
                            <span>Found Wallet</span>
                            <div className={styles.fakeTag}>💼</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className={styles.features}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <div className={styles.grid}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={megaphoneIcon} alt="Report" className={styles.featureIcon} />
                        </div>
                        <h3>Report Lost</h3>
                        <p>Post details about your missing item so others can help you find it.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={searchIcon} alt="Search" className={styles.featureIcon} />
                        </div>
                        <h3>Search Found</h3>
                        <p>Browse items found by the community to see if yours is waiting for you.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <img src={chatIcon} alt="Connect" className={styles.featureIcon} />
                        </div>
                        <h3>Connect Securely</h3>
                        <p>Chat with finders or owners directly through our secure platform.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
