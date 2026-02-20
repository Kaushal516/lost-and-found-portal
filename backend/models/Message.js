
import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    senderUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    senderAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },
    text: {
      type: String,
      required: false // Not required if attachment exists
    },
    attachment: {
      url: { type: String },
      publicId: { type: String },
      type: { type: String, default: 'image' }
    },
    reactions: {
      type: [reactionSchema],
      default: []
    },
    read: { type: Boolean, default: false },
    readAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
