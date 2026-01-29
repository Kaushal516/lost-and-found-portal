import LostItem from "../models/LostItem.js";

// CREATE LOST ITEM (AUTH REQUIRED)
export const createLostItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      dateLost,
      images
    } = req.body;

    const lostItem = await LostItem.create({
      title,
      description,
      category,
      location,
      dateLost,
      images,
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
      .populate("postedBy", "email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

