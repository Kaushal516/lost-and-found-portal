import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";
import User from "../models/User.js";
import { getOnlineUsersCount } from "../socket/socket.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const [
      totalLost,
      lostActive,
      lostResolved,
      totalFound,
      foundActive,
      foundInProcess,
      foundResolved,
      totalUsers
    ] = await Promise.all([
      LostItem.countDocuments(),
      LostItem.countDocuments({ $or: [{ status: "active" }, { status: { $exists: false } }] }),
      LostItem.countDocuments({ status: "resolved" }),
      FoundItem.countDocuments(),
      FoundItem.countDocuments({ status: "active" }),
      FoundItem.countDocuments({ status: "In Process" }),
      FoundItem.countDocuments({ status: "resolved" }),
      User.countDocuments()
    ]);

    // Get online users from socket memory
    const onlineUsers = getOnlineUsersCount();

    res.json({
      totalLost,
      lostActive,
      lostResolved,
      totalFound,
      foundActive,
      foundInProcess,
      foundResolved,
      totalUsers,
      onlineUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
