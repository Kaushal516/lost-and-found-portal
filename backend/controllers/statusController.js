import FoundItem from "../models/FoundItem.js";
import LostItem from "../models/LostItem.js";
import Notification from "../models/Notification.js";
import { sendNotificationToUser } from "../socket/socket.js";

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

    // Notify the Original Poster
    const notif = await Notification.create({
      recipient: foundItem.postedBy,
      type: "ITEM_CLAIMED",
      message: `Someone has claimed your found item: ${foundItem.title}`,
      relatedItem: foundItem._id,
      itemModel: "FoundItem",
      link: `/found/${foundItem._id}` // assuming detailed view exists or just /search
    });
    sendNotificationToUser(foundItem.postedBy.toString(), notif);

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

    // Notify the Original Poster
    const notif = await Notification.create({
      recipient: foundItem.postedBy,
      type: "GENERAL",
      message: `Admin has resolved the status of your item: ${foundItem.title}`,
      relatedItem: foundItem._id,
      itemModel: "FoundItem",
      link: `/my-posts`
    });
    sendNotificationToUser(foundItem.postedBy.toString(), notif);

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

    // Notify Poster
    const notif = await Notification.create({
      recipient: lostItem.postedBy,
      type: "GENERAL",
      message: `Your lost item has been resolved: ${lostItem.title}`,
      relatedItem: lostItem._id,
      itemModel: "LostItem",
      link: `/my-posts`
    });
    sendNotificationToUser(lostItem.postedBy.toString(), notif);

    return res.json({
      message: "Lost item resolved successfully",
      lostItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
