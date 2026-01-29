import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const [
      totalLost,
      totalFound,
      claimedFound,
      activeFound
    ] = await Promise.all([
      LostItem.countDocuments(),
      FoundItem.countDocuments(),
      FoundItem.countDocuments({ status: "claimed" }),
      FoundItem.countDocuments({ status: "active" })
    ]);

    res.json({
      totalLost,
      totalFound,
      claimedFound,
      activeFound
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
