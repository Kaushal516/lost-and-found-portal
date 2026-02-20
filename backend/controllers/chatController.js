import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import Admin from "../models/Admin.js";
import { getIO } from "../socket/ioInstance.js";
import mongoose from "mongoose";

/**
 * GET ALL CHATS FOR CURRENT USER
 */
/**
 * GET ALL CHATS FOR CURRENT USER (ADMIN OR REGULAR USER)
 * Returns only ONE chat per distinct conversation partner.
 */
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const isUserAdmin = req.user.type === "admin";

    // Match condition based on role
    // Admin: sees chats where they are 'admin' AND participants size is 1 (Direct Chat)
    // User: sees chats where they are in 'participants'
    const matchStage = isUserAdmin
      ? {
        admin: new mongoose.Types.ObjectId(userId),
        $expr: { $eq: [{ $size: "$participants" }, 1] }
      }
      : { participants: new mongoose.Types.ObjectId(userId) };

    const chats = await Chat.aggregate([
      { $match: matchStage },
      { $sort: { updatedAt: -1 } },
      // Identify the "Partner" for grouping
      // For Admin: Partner is the participant(s).
      // For User: Partner is the *other* participant. If none, it's Admin.
      {
        $addFields: {
          others: {
            $filter: {
              input: "$participants",
              as: "p",
              cond: { $ne: ["$$p", new mongoose.Types.ObjectId(userId)] }
            }
          }
        }
      },
      {
        $group: {
          // Group by the "Partner ID"
          // If others exist, group by the first one.
          // If others is empty (Direct Admin chat where user is sole participant), group by Admin.
          // Group by the "Partner ID"
          // If others exist, group by the first one.
          // If others is empty (Direct Admin chat), group by Admin.
          // IF AM I ADMIN? I group by user (others).
          // IF AM I USER? I group by Partner (others) OR Admin if others empty.
          _id: {
            $cond: {
              if: { $gt: [{ $size: "$others" }, 0] },
              then: { $arrayElemAt: ["$others", 0] },
              else: "$admin"
            }
          },
          chatId: { $first: "$_id" },
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      // Lookup unread messages count
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chat", "$$chatId"] },
                    { $eq: ["$read", false] },
                    // Check if sender is NOT the current user
                    {
                      $or: [
                        { $ne: ["$senderUser", new mongoose.Types.ObjectId(userId)] },
                        { $ne: ["$senderAdmin", new mongoose.Types.ObjectId(userId)] }
                      ]
                    }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "unreadInfo"
        }
      },
      {
        $addFields: {
          unreadCount: { $ifNull: [{ $arrayElemAt: ["$unreadInfo.count", 0] }, 0] }
        }
      },
      { $sort: { updatedAt: -1 } }
    ]);

    const populatedChats = await Chat.populate(chats, [
      { path: "participants", select: "username email firstName lastName" },
      { path: "admin", select: "username email firstName lastName" }
    ]);

    return res.json(populatedChats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE OR GET DIRECT CHAT (ADMIN <-> USER)
 * - Admin clicks "Chat" on User List
 */
export const createDirectChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const adminId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // Check if a DIRECT chat (item: null) already exists
    let chat = await Chat.findOne({
      participants: { $in: [userId] },
      admin: adminId,
      item: null
    })
      .populate("participants", "username email")
      .populate("admin", "username email");

    if (chat) {
      return res.json(chat);
    }

    // Create new direct chat
    chat = await Chat.create({
      item: null,
      itemModel: null,
      participants: [userId],
      admin: adminId
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

    // Resolve item model (just for validation/context)
    let item;
    if (itemType === "lost") {
      item = await LostItem.findById(itemId);
    } else if (itemType === "found") {
      item = await FoundItem.findById(itemId);
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const admin = await Admin.findOne();
    // Default fallback if we can't find an admin, but for User-User we don't strictly need one yet

    // Determine Target: The Item Owner
    const ownerId = item.postedBy.toString();

    // Case 1: I am the Owner (Maybe I want to chat with Admin about my item?)
    // Or just prevent?
    if (ownerId === userId) {
      // Chat with Admin
      if (!admin) return res.status(500).json({ message: "No admin available" });

      let chat = await Chat.findOne({
        admin: admin._id,
        participants: userId
      }).sort({ updatedAt: -1 });

      if (chat) {
        const fullChat = await Chat.findById(chat._id)
          .populate("participants", "username email")
          .populate("admin", "username email");
        return res.json(fullChat);
      }

      chat = await Chat.create({
        item: itemId,
        itemModel: itemType === "lost" ? "LostItem" : "FoundItem",
        participants: [userId],
        admin: admin._id
      });

      const fullChat = await Chat.findById(chat._id)
        .populate("participants", "username email")
        .populate("admin", "username email");
      return res.status(201).json(fullChat);
    }

    // Case 2: User-to-User Chat (I am Seeker, Owner is Target)
    // Check for existing chat between Me and Owner
    let chat = await Chat.findOne({
      participants: { $all: [userId, ownerId] },
      admin: null // Ideally Find Pure User Chat
    }).sort({ updatedAt: -1 });

    // If no pure user chat, maybe one exists with admin? 
    // But we want to prioritize the direct link.

    if (chat) {
      const fullChat = await Chat.findById(chat._id)
        .populate("participants", "username email")
        .populate("admin", "username email");
      return res.json(fullChat);
    }

    // Create User-to-User Chat
    chat = await Chat.create({
      item: itemId,
      itemModel: itemType === "lost" ? "LostItem" : "FoundItem",
      participants: [userId, ownerId],
      admin: null // No admin initially
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
 * GET COMMUNITY CHATS (ADMIN ONLY)
 * Returns all User-to-User chats
 */
export const getCommunityChats = async (req, res) => {
  try {
    const { type } = req.query; // "LostItem" or "FoundItem"

    // Community Chats = Chats with >= 2 participants (User-to-User)
    // Regardless of whether Admin has joined or not.
    const query = {
      $expr: { $gte: [{ $size: "$participants" }, 2] }
    };

    if (type) {
      query.itemModel = type;
    }

    const chats = await Chat.find(query)
      .populate("participants", "username email")
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN JOIN CHAT
 * Admin enters a User-User chat
 */
export const adminJoinChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const adminId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // If already has this admin, do nothing
    if (chat.admin && chat.admin.toString() === adminId) {
      return res.json(chat);
    }

    chat.admin = adminId;
    await chat.save();

    const fullChat = await Chat.findById(chat._id)
      .populate("participants", "username email")
      .populate("admin", "username email");

    return res.json(fullChat);
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

    // Validate: must have either text or file
    if (!chatId || (!text && !req.file)) {
      return res.status(400).json({ message: "Message content required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Authorization check
    const isParticipant = chat.participants
      .map(id => id.toString())
      .includes(req.user.id);

    const isAdmin = chat.admin && (chat.admin.toString() === req.user.id);

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to chat" });
    }

    const messageData = {
      chat: chatId,
      text: text || "" // Ensure string if undefined
    };

    if (req.file) {
      messageData.attachment = {
        url: req.file.path,
        publicId: req.file.filename,
        type: 'image'
      };
    }

    if (req.user.type === "admin") {
      messageData.senderAdmin = req.user.id;
    } else {
      messageData.senderUser = req.user.id;
    }

    const message = await Message.create(messageData);

    const populatedMessage = await Message.findById(message._id)
      .populate("senderUser", "username email")
      .populate("senderAdmin", "username email");

    // Socket Emits
    const io = getIO();
    io.to(chatId).emit("message received", populatedMessage);

    // Notify other participants (User Room)
    // We need to know who the participants are. We fetched 'chat' but didn't populate it fully?
    // chat.participants checks the ID array.
    // If Admin sent, notify User. If User sent, notify Admin (wait Admin ID is simplified)

    // Simplification: Emit to the 'other' person.
    // If I am User, other is Admin (chat.admin)
    // If I am Admin, other is User (chat.participants[0])

    // Better: Just emit to ALL participants + Admin (except sender)
    // But we only have IDs.

    chat.participants.forEach(pId => {
      if (pId.toString() !== req.user.id) {
        io.to(pId.toString()).emit("notification", populatedMessage);
      }
    });

    if (chat.admin.toString() !== req.user.id) {
      io.to(chat.admin.toString()).emit("notification", populatedMessage);
    }

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

/**
 * ADD OR TOGGLE REACTION ON A MESSAGE
 * - Body: { emoji }
 * - If current user already reacted with this emoji, remove it; else add
 */
export const addOrToggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji || typeof emoji !== "string" || emoji.length > 10) {
      return res.status(400).json({ message: "Valid emoji required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const chat = await Chat.findById(message.chat);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants
      .map((id) => id.toString())
      .includes(userId);
    const isAdmin = chat.admin.toString() === userId;
    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existingIndex = (message.reactions || []).findIndex(
      (r) => r.userId.toString() === userId && r.emoji === emoji
    );

    if (existingIndex >= 0) {
      message.reactions.splice(existingIndex, 1);
    } else {
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    const updated = await Message.findById(message._id)
      .populate("senderUser", "username email")
      .populate("senderAdmin", "username email");

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * MARK MESSAGES AS READ
 * - Body: { chatId }
 */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;

    if (!chatId) return res.status(400).json({ message: "Chat ID required" });

    // Update all messages in this chat where:
    // 1. Chat matches
    // 2. Read is false
    // 3. Sender is NOT the current user
    await Message.updateMany(
      {
        chat: chatId,
        read: false,
        $or: [
          { senderUser: { $ne: userId } },
          { senderAdmin: { $ne: userId } }
        ]
      },
      {
        $set: { read: true, readAt: new Date() }
      }
    );

    // Emit socket event to notify sender(s) that messages were read
    const io = getIO();
    io.to(chatId).emit("messagesRead", { chatId, userId });

    return res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};