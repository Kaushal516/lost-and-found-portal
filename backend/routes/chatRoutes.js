import express from "express";
import {
  accessChat,
  sendMessage,
  getMessages,
  addOrToggleReaction,
  createDirectChat,
  getChats,
  markMessagesAsRead,
  getCommunityChats,
  adminJoinChat
} from "../controllers/chatController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

import { upload } from "../middleware/uploadMiddleware.js";

// All chat routes are protected
router.get("/", protect, getChats);
router.post("/", protect, accessChat);
router.post("/direct", protect, adminOnly, createDirectChat);
router.get("/community", protect, adminOnly, getCommunityChats);
router.post("/join", protect, adminOnly, adminJoinChat);
router.post("/message", protect, upload.single("file"), sendMessage);
router.put("/read", protect, markMessagesAsRead);
router.put("/message/:messageId/reaction", protect, addOrToggleReaction);
router.get("/:chatId", protect, getMessages);

export default router;
