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
