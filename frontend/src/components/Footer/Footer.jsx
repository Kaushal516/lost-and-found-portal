import styles from "./Footer.module.css";
import logo from "../../assets/logo.png";
import { Github, Twitter, Instagram, Mail, ExternalLink, ShieldCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brandColumn}>
                    <img src={logo} alt="Lost & Found Portal" className={styles.logo} />
                    <p className={styles.description}>
                        Making campus life easier by reconnecting you with your lost belongings. Safe, secure, and community-driven.
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
                    <h4>Platform</h4>
                    <Link to="/search">Find Belongings</Link>
                    <Link to="/found/new">Post Found Item</Link>
                    <Link to="/lost/new">Report Lost Item</Link>
                    <Link to="/chat">Campus Chat</Link>
                </div>

                <div className={styles.linkColumn}>
                    <h4>Resources</h4>
                    <a href="#">Help Center</a>
                    <a href="#">Success Stories</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>

                <div className={styles.linkColumn}>
                    <h4>Contact Us</h4>
                    <div className={styles.contactItem}>
                        <Mail size={16} />
                        <span>support@campuslf.com</span>
                    </div>
                    <div className={styles.contactItem}>
                        <ShieldCheck size={16} />
                        <span>Verified Community</span>
                    </div>
                    <div className={styles.contactItem}>
                        <Globe size={16} />
                        <span>Global Network</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.bottomContent}>
                    <p>&copy; {new Date().getFullYear()} Lost & Found Portal. Built with ❤️ for Students.</p>
                    <div className={styles.bottomLinks}>
                        <a href="#">Cookies</a>
                        <a href="#">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
