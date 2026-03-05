import styles from "./Footer.module.css";
import logo from "../../assets/logo.png";
import { Github, Twitter, Instagram, Mail, ExternalLink, ShieldCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brandColumn}>
                    <img src={logo} alt="Lost & Found Portal" className={styles.logo} />
                    <p className={styles.description}>
                        {t('footer.description')}
                    </p>
                    <div className={styles.socials}>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <Github size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <Twitter size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>

                <div className={styles.linkColumn}>
                    <h4>{t('footer.platform')}</h4>
                    <Link to="/search">{t('footer.findBelongings')}</Link>
                    <Link to="/found/new">{t('footer.postFound')}</Link>
                    <Link to="/lost/new">{t('footer.reportLost')}</Link>
                    <Link to="/chat">{t('footer.campusChat')}</Link>
                </div>

                <div className={styles.linkColumn}>
                    <h4>{t('footer.resources')}</h4>
                    <a href="#">{t('footer.helpCenter')}</a>
                    <a href="#">{t('footer.successStories')}</a>
                    <a href="#">{t('footer.privacyPolicy')}</a>
                    <a href="#">{t('footer.termsOfService')}</a>
                </div>

                <div className={styles.linkColumn}>
                    <h4>{t('footer.contactUs')}</h4>
                    <div className={styles.contactItem}>
                        <Mail size={16} />
                        <span>support@campuslf.com</span>
                    </div>
                    <div className={styles.contactItem}>
                        <ShieldCheck size={16} />
                        <span>{t('footer.verifiedCommunity')}</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Globe size={16} />
                        <span>{t('footer.globalNetwork')}</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.bottomContent}>
                    <p>&copy; {new Date().getFullYear()} Lost & Found Portal. {t('footer.builtWith')}</p>
                    <div className={styles.bottomLinks}>
                        <a href="#">{t('footer.cookies')}</a>
                        <a href="#">{t('footer.security')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
