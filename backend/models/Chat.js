import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "itemModel",
      required: true
    },
    itemModel: {
      type: String,
      required: true,
      enum: ["LostItem", "FoundItem"]
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);