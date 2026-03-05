import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["NEW_MESSAGE", "POST_APPROVED", "POST_REJECTED", "MATCH_FOUND", "GENERAL", "ITEM_CLAIMED", "ITEM_RESOLVED", "CLAIM_APPROVED", "CLAIM_REJECTED"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String, // Optional URL to navigate to when clicked
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedItem: {
            type: mongoose.Schema.Types.ObjectId, // Can refer to LostItem, FoundItem, or Chat
            refPath: "itemModel",
        },
        itemModel: {
            type: String,
            enum: ["LostItem", "FoundItem", "Chat"],
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
