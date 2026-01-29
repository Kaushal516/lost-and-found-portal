import express from "express";
import {
  accessChat,
  sendMessage,
  getMessages
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All chat routes are protected
router.post("/", protect, accessChat);
router.post("/message", protect, sendMessage);
router.get("/:chatId", protect, getMessages);

export default router;
