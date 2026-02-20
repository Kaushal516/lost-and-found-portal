
// REJECT CLAIM (ADMIN ONLY)
export const rejectClaim = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.status !== "In Process") {
            return res.status(400).json({ message: "Item is not currently claimed" });
        }

        item.status = "active";
        item.claimedBy = null;

        await item.save();

        res.json({ message: "Claim rejected", item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// RESOLVE CLAIM (ADMIN ONLY)
export const resolveFoundItem = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.status = "resolved";
        // claimedBy remains set to keep record of who got it

        await item.save();

        res.json({ message: "Item resolved", item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
