import styles from "./ContactModal.module.css";
import { createPortal } from "react-dom";
import { X, Mail, Phone } from "lucide-react";

const ContactModal = ({ user, onClose }) => {
    if (!user) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                <h3 className={styles.title}>Contact Details</h3>

                <div className={styles.detailRow}>
                    <Mail size={18} className={styles.icon} />
                    <p>{user.email || "Email not available"}</p>
                </div>
                <div className={styles.detailRow}>
                    <Phone size={18} className={styles.icon} />
                    <p>{user.phoneNumber || "Phone not available"}</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
