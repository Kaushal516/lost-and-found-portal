import FoundItem from "../models/FoundItem.js";

// CREATE FOUND ITEM (AUTH REQUIRED)
export const createFoundItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      dateFound,
      images
    } = req.body;

    const foundItem = await FoundItem.create({
      title,
      description,
      category,
      location,
      dateFound,
      images,
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
      .populate("postedBy", "firstName lastName email");

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
    }

    const items = await FoundItem.find(filter)
      .populate("postedBy", "username email")
      .sort({ updatedAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch found items",
      error: error.message
    });
  }
};

