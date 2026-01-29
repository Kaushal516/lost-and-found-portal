import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

/**
 * GET logged-in user's lost items
 */
export const getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({
      postedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET logged-in user's found items
 */
export const getMyFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find({
      postedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
