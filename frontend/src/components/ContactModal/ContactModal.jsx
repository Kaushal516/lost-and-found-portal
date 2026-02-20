import styles from "./ContactModal.module.css";

const ContactModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Contact Details</h3>

                <p>{user.email || "Email not available"}</p>
                <p>{user.phoneNumber || "Phone not available"}</p>

                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ContactModal;
