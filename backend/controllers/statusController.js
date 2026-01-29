import FoundItem from "../models/FoundItem.js";
import LostItem from "../models/LostItem.js";

/**
 * USER CLAIMS A FOUND ITEM
 * Status: active → claimed
 */
export const claimFoundItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const foundItem = await FoundItem.findById(itemId);
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    if (foundItem.status !== "active") {
      return res.status(400).json({
        message: "This item cannot be claimed"
      });
    }

    foundItem.status = "claimed";
    await foundItem.save();

    return res.json({
      message: "Found item successfully claimed",
      foundItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN RESOLVES FOUND ITEM
 * Status: claimed → resolved
 */
export const resolveFoundItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const foundItem = await FoundItem.findById(itemId);
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    if (foundItem.status !== "claimed") {
      return res.status(400).json({
        message: "Only claimed items can be resolved"
      });
    }

    foundItem.status = "resolved";
    await foundItem.save();

    return res.json({
      message: "Found item resolved successfully",
      foundItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ADMIN RESOLVES LOST ITEM
 * Status: matched → resolved
 */
export const resolveLostItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const lostItem = await LostItem.findById(itemId);
    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    if (lostItem.status === "resolved") {
      return res.status(400).json({
        message: "Lost item already resolved"
      });
    }

    lostItem.status = "resolved";
    await lostItem.save();

    return res.json({
      message: "Lost item resolved successfully",
      lostItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
