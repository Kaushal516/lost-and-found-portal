import mongoose from "mongoose";

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
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
