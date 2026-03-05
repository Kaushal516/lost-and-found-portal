import User from "../models/User.js";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import DeletionRequest from "../models/DeletionRequest.js";

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

// GET ALL DELETION REQUESTS
export const getDeletionRequests = async (req, res) => {
  try {
    const requests = await DeletionRequest.find({ status: "pending" })
      .populate("user", "firstName lastName username email phoneNumber");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PERMANENTLY DELETE USER AND DATA
export const deleteUserPermanently = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete User's items
    await Promise.all([
      LostItem.deleteMany({ postedBy: userId }),
      FoundItem.deleteMany({ postedBy: userId }),
      DeletionRequest.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({ message: "User and all associated data deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
