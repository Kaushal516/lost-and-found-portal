import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    // Use environment variables for credentials
    // For dev: You can use Ethereal or your own Gmail with App Password
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail", // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });



    const mailOptions = {
        from: process.env.EMAIL_FROM || "Lost & Found Portal <noreply@lostfound.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${options.email}`);
        return true; // Sent successfully
    } catch (error) {
        console.error("❌ EMAIL ERROR DETAILS:", error.message); // Show the REAL error
        console.warn("⚠️ Email sending failed. Defaulting to console log.");
        console.log("==========================================");
        console.log(`TO: ${options.email}`);
        console.log(`SUBJECT: ${options.subject}`);
        console.log(`MESSAGE:\n${options.message}`);
        console.log("==========================================");
        return false; // Mocked
    }
};

export default sendEmail;
