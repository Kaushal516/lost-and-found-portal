import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    dateFound: {
      type: Date,
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    status: {
      type: String,
      enum: ["active", "In Process", "resolved"],
      default: "active"
    },
    resolvedAt: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 432000 } // 5 days
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 1 && val.length <= 5;
        },
        message: "Found item must have 1 to 5 images"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("FoundItem", foundItemSchema);
