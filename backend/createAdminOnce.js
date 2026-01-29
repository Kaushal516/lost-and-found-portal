import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
// ONLY dependency
import Admin from "./models/Admin.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@gmail.com";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    await Admin.create({
      username: "System_Admin",
      email,
      password: hashedPassword,
      phoneNumber: "+1234567890"
    });

    console.log("🎉 Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();