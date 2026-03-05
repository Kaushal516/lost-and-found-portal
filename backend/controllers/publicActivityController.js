import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

export const getRecentActivity = async (req, res) => {
    try {
        const lostItems = await LostItem.find({ status: { $ne: "resolved" } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title category createdAt location");

        const foundItems = await FoundItem.find({ status: { $ne: "resolved" } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title category createdAt location");

        const activity = [
            ...lostItems.map(item => ({ ...item._doc, type: "lost" })),
            ...foundItems.map(item => ({ ...item._doc, type: "found" }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch recent activity", error: error.message });
    }
};
