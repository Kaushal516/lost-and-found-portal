import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Admin from "../models/Admin.js";
import { getIO } from "../socket/ioInstance.js";

/**
 * CREATE OR GET CHAT
 * - User clicks "Chat" on an item
 * - Admin is auto-joined
 */
export const accessChat = async (req, res) => {
  try {
    const { itemId, itemType } = req.body; // itemType: "lost" | "found"
    const userId = req.user.id;

    if (!itemId || !itemType) {
      return res.status(400).json({ message: "Item info required" });
    }

    // Resolve item model
    let item;
    let itemModel;

    if (itemType === "lost") {
      item = await LostItem.findById(itemId);
      itemModel = "LostItem";
    } else if (itemType === "found") {
      item = await FoundItem.findById(itemId);
      itemModel = "FoundItem";
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Get primary admin (auto-join)
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({
        message: "No admin available. Please contact system administrator."
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      item: itemId,
      participants: { $all: [item.postedBy, userId] }
    })
      .populate("participants", "username email")
      .populate("admin", "username email");

    if (chat) {
      return res.json(chat);
    }

    // Create new chat with admin auto-joined
    chat = await Chat.create({
      item: itemId,
      itemModel,
      participants: [item.postedBy, userId],
      admin: admin._id
    });

    const fullChat = await Chat.findById(chat._id)
      .populate("participants", "username email")
      .populate("admin", "username email");

    return res.status(201).json(fullChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * SEND MESSAGE
 * - Allowed: participants or admin
 */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ message: "Message data required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Authorization check
    const isParticipant = chat.participants
      .map(id => id.toString())
      .includes(req.user.id);

    const isAdmin = chat.admin.toString() === req.user.id;

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to chat" });
    }

    const messageData = {
      chat: chatId,
      text
    };

    if (req.user.type === "admin") {
      messageData.senderAdmin = req.user.id;
    } else {
      messageData.senderUser = req.user.id;
    }

    const message = await Message.create(messageData);

    const populatedMessage = await Message.findById(message._id)
      .populate("senderUser", "username email")
      .populate("senderAdmin", "username email");

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL MESSAGES FOR A CHAT
 * - Allowed: participants or admin
 */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Authorization check
    const isParticipant = chat.participants
      .map(id => id.toString())
      .includes(req.user.id);

    const isAdmin = chat.admin.toString() === req.user.id;

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("senderUser", "username email")
      .populate("senderAdmin", "username email")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};