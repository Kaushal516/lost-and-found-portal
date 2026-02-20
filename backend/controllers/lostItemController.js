import LostItem from "../models/LostItem.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";

// CREATE LOST ITEM (AUTH REQUIRED)
export const createLostItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      dateLost
    } = req.body;

    // Images come from multer (req.files), NOT req.body
    const files = req.files || [];

    // Max 5 images validation
    if (files.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed"
      });
    }

    // Upload images to Cloudinary (optional for lost items)
    const imageUrls =
      files.length > 0
        ? await uploadImagesToCloudinary(files, "lost-items")
        : [];

    const lostItem = await LostItem.create({
      title,
      description,
      category,
      location,
      dateLost,
      images: imageUrls,
      postedBy: req.user.id
    });

    res.status(201).json(lostItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LOST ITEMS (AUTH REQUIRED)
export const getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate("postedBy", "firstName lastName email phoneNumber")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET LOST ITEMS (ADMIN ONLY)
 * Optional query:
 * - status (active | resolved)
 */
export const getLostItems = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      if (status === "active") {
        // Match 'active' OR missing status (legacy support)
        filter.$or = [{ status: "active" }, { status: { $exists: false } }];
      } else {
        filter.status = status;
      }
    }

    const items = await LostItem.find(filter)
      .populate("postedBy", "firstName lastName email phoneNumber")
      .sort({ updatedAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch lost items",
      error: error.message
    });
  }
};

// RESOLVE LOST ITEM (ADMIN ONLY)
export const resolveLostItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);

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
