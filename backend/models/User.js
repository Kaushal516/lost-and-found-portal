import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    resetPasswordOtp: {
      type: String,
      required: false
    },
    resetPasswordExpire: {
      type: Date,
      required: false
    },
    profileImg: {
      type: String,
      default: ""
    },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: true },
      defaultView: { type: String, enum: ["grid", "list"], default: "grid" },
      defaultLanguage: { type: String, default: "en" },
      theme: { type: String, enum: ["light", "dark"], default: "light" }
    }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
