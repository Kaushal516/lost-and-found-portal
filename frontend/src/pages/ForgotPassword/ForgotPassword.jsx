import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import styles from "./ForgotPassword.module.css";
import Navbar from "../../components/Navbar/Navbar"; // Reuse standard navbar if needed or rely on App layout

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await api.post("/users/forgot-password", { email });
            setStep(2);
            setMessage("OTP sent to your email.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/users/reset-password", {
                email,
                otp,
                password: newPassword
            });
            setMessage("Password reset successful! Redirecting...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp}>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className={styles.inputGroup}>
                            <label>OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={styles.button}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={styles.linkButton}
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    <span onClick={() => navigate("/login")}>Back to Login</span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
