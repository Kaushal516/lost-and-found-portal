import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Username rules:
 * - No spaces
 * - Only letters, numbers, underscore
 * - Min 4 chars, Max 20 chars
 */
const usernameRegex = /^[a-zA-Z0-9_]+$/;

// =======================
// USER REGISTER
// =======================
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password,
      confirmPassword
    } = req.body;

    // Basic required field check
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Username validation
    if (
      username.length < 4 ||
      username.length > 20 ||
      !usernameRegex.test(username)
    ) {
      return res.status(400).json({
        message:
          "Username must be 4–20 characters and contain only letters, numbers, or underscores"
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// =======================
// USER LOGIN
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, type: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to user (valid for 10 mins)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Email
    const message = `Your Password Reset OTP is: ${otp}\n\nIt is valid for 10 minutes.`;

    try {
      // Dynamic import to avoid top-level dependency issues if file missing initially
      const sendEmail = (await import("../utils/sendEmail.js")).default;

      const emailSent = await sendEmail({
        email: user.email,
        subject: "Password Reset OTP - Lost & Found",
        message
      });

      if (emailSent) {
        res.status(200).json({ message: "OTP sent to email" });
      } else {
        // Tell user to check console if email failed (Mock Mode)
        res.status(200).json({ message: "OTP generated. Check Backend Terminal for code." });
      }
    } catch (emailError) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent. Please try again." });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Find user with matching Email, OTP, and not expired
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
