import styles from "./ContactModal.module.css";
import { createPortal } from "react-dom";
import { X, Mail, Phone } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const ContactModal = ({ user, onClose }) => {
    const { t } = useLanguage();
    if (!user) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose} aria-label={t('common.cancel')}>
                    <X size={20} />
                </button>

                <h3 className={styles.title}>{t('contact.title')}</h3>

                <div className={styles.detailRow}>
                    <Mail size={18} className={styles.icon} />
                    <p>{user.email || t('contact.emailNotAvailable')}</p>
                </div>
                <div className={styles.detailRow}>
                    <Phone size={18} className={styles.icon} />
                    <p>{user.phoneNumber || t('contact.phoneNotAvailable')}</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
