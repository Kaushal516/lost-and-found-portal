
// CLAIM FOUND ITEM (AUTH REQUIRED)
export const claimFoundItem = async (req, res) => {
    try {
        const item = await FoundItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.status !== "active") {
            return res.status(400).json({ message: "Item is not available for claiming" });
        }

        // Optional: Prevent owner from claiming their own item?
        // if (item.postedBy.toString() === req.user.id) {
        //   return res.status(400).json({ message: "You cannot claim your own item" });
        // }

        item.status = "In Process";
        item.claimedBy = req.user.id;

        await item.save();

        // Population for returning full object if needed
        await item.populate("postedBy", "firstName lastName email phoneNumber");
        await item.populate("claimedBy", "firstName lastName email phoneNumber");

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
