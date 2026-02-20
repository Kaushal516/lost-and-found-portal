import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Documents",
        "Clothing",
        "Accessories",
        "Other",
      ],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    dateLost: {
      type: Date,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    resolvedAt: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 432000 }, // 5 days
    },
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);
export default LostItem;
