import cron from "node-cron";
import LostItem from "../models/LostItem.js";
import FoundItem from "../models/FoundItem.js";

const initializeCleanupJob = () => {
    // Run every day at midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("🧹 Running automated cleanup job...");

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        try {
            // 1. Delete Stale Lost Items (Active & older than 30 days)
            const lostResult = await LostItem.deleteMany({
                status: "active",
                createdAt: { $lt: thirtyDaysAgo }
            });

            // 2. Delete Stale Found Items (Active/In Process & older than 30 days)
            const foundResult = await FoundItem.deleteMany({
                status: { $in: ["active", "In Process"] },
                createdAt: { $lt: thirtyDaysAgo }
            });

            console.log(`✅ Cleanup finished. Removed ${lostResult.deletedCount} stale lost reports and ${foundResult.deletedCount} stale found reports.`);
        } catch (error) {
            console.error("❌ Cleanup job failed:", error);
        }
    });

    console.log("🚀 Automated cleanup service initialized (Daily at 00:00)");
};

export default initializeCleanupJob;
