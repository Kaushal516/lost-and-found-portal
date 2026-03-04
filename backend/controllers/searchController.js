import FoundItem from "../models/FoundItem.js";

/**
 * SEARCH FOUND ITEMS
**/
export const searchFoundItems = async (req, res) => {
  try {
    const { q, category, date, tags } = req.query;

    const filter = {
      title: { $regex: q || "", $options: "i" } // partial + case-insensitive
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (tags) {
      // Tags come as a comma-separated string e.g., "wallet,blue"
      const tagsArray = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
      if (tagsArray.length > 0) {
        // Find items that have *all* of the requested tags in their tags array
        filter.tags = { $all: tagsArray };
      }
    }

    if (date) {
      const d = new Date(date);
      filter.createdAt = {
        $gte: new Date(d.setHours(0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59))
      };
    }

    const items = await FoundItem.find(filter)
      .populate("postedBy", "email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

