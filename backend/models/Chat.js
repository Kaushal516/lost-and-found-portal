import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "itemModel",
      required: false
    },
    itemModel: {
      type: String,
      required: false,
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
      ref: "Admin"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);