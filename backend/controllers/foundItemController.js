import FoundItem from "../models/FoundItem.js";
import Notification from "../models/Notification.js";
import Admin from "../models/Admin.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";
import { extractTags } from "../utils/extractTags.js";
import { sendNotificationToUser } from "../socket/socket.js";

// CREATE FOUND ITEM (AUTH REQUIRED)
export const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      dateFound
    } = req.body;

    // Images come from multer (req.files)
    const files = req.files || [];

    // Max 5 images validation
    if (files.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed"
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        message: "At least 1 image is required for Found Item"
      });
    }

    // Upload to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(files, "found-items");

    // Auto-extract tags
    const tags = extractTags(title, description);

    const foundItem = await FoundItem.create({
      title,
      description,
      category,
      location,
      dateFound,
      tags,
      images: imageUrls,
      postedBy: req.user.id
    });

    res.status(201).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL FOUND ITEMS (AUTH REQUIRED)
export const getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find()
      .populate("postedBy", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET FOUND ITEMS (ADMIN ONLY)
 * Optional query:
 * - status (active | claimed | resolved)
 */
export const getFoundItems = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    } else {
      // By default, hide items that are currently "In Process" (handled in Claims page)
      filter.status = { $ne: "In Process" };
    }

    const items = await FoundItem.find(filter)
      .populate("postedBy", "firstName lastName email phoneNumber")
      .populate("claimedBy", "firstName lastName email phoneNumber")
      .sort({ updatedAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch found items",
      error: error.message
    });
  }
};

// CLAIM FOUND ITEM (AUTH REQUIRED)
export const claimFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status !== "active") {
      return res.status(400).json({ message: "Item is not available for claiming" });
    }

    item.status = "In Process";
    item.claimedBy = req.user.id;

    await item.save();

    // Populate helpful fields
    await item.populate("postedBy", "firstName lastName email phoneNumber");
    await item.populate("claimedBy", "firstName lastName email phoneNumber");

    // 1. Notify the user who originally posted the Found Item
    if (item.postedBy && item.postedBy._id.toString() !== req.user.id) {
      const notif = await Notification.create({
        recipient: item.postedBy._id,
        type: "ITEM_CLAIMED",
        message: `Your found item "${item.title}" has been claimed by ${item.claimedBy.firstName}.`,
        link: `/dashboard`
      });
      sendNotificationToUser(item.postedBy._id.toString(), notif);
    }

    // 2. Notify Admins (Admins don't have Notification documents in this schema, so just socket)
    try {
      const admins = await Admin.find({});
      admins.forEach(admin => {
        const adminNotif = {
          _id: new Date().getTime().toString(), // fake ID for key prop
          type: "ITEM_CLAIMED",
          message: `User ${item.claimedBy.firstName} claimed the item: "${item.title}".`,
          createdAt: new Date(),
          read: false,
          link: `/admin/found-items`
        };
        sendNotificationToUser(admin._id.toString(), adminNotif);
      });
    } catch (adminErr) {
      console.error("Error notifying admins:", adminErr);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT CLAIM (ADMIN ONLY)
export const rejectClaim = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status !== "In Process") {
      return res.status(400).json({ message: "Item is not currently claimed" });
    }

    item.status = "active";
    item.claimedBy = null;

    await item.save();

    res.json({ message: "Claim rejected", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESOLVE CLAIM (ADMIN ONLY)
export const resolveFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "resolved";
    item.resolvedAt = new Date();

    await item.save();

    res.json({ message: "Item resolved", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
