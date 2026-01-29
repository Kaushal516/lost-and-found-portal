import express from "express";
import { getDashboardCounts } from "../controllers/dashboardController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Admin dashboard counts
 * Only accessible by admin
 */
router.get("/dashboard", protect, adminOnly, getDashboardCounts);

export default router;
