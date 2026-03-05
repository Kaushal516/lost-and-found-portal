import mongoose from "mongoose";
import dotenv from "dotenv";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import FoundItem from "../models/FoundItem.js";

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const user = await User.findOne();
        const item = await FoundItem.findOne();

        if (!user || !item) {
            console.log("Not enough data to test");
            process.exit(0);
        }

        const notif = await Notification.create({
            recipient: user._id,
            type: "ITEM_RESOLVED",
            message: `Test notification for item ${item.title}`,
            relatedItem: item._id,
            itemModel: "FoundItem"
        });

        console.log("Notification created successfully:", notif._id);

        // Cleanup
        await Notification.findByIdAndDelete(notif._id);
        console.log("Cleanup done");

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
