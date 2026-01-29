import User from "../models/User.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

// GET ALL USERS (WITH PHONE NUMBERS)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "firstName lastName username email phoneNumber"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LOST ITEMS WITH USER PHONE
export const getLostItemsWithContact = async (req, res) => {
  try {
    const items = await LostItem.find().populate(
      "postedBy",
      "firstName lastName email phoneNumber"
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FOUND ITEMS WITH USER PHONE
export const getFoundItemsWithContact = async (req, res) => {
  try {
    const items = await FoundItem.find().populate(
      "postedBy",
      "firstName lastName email phoneNumber"
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
