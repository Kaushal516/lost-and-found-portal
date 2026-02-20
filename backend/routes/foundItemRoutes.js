import express from "express";
import {
  createFoundItem,
  getAllFoundItems,
  getFoundItems,
  claimFoundItem,
  rejectClaim,
  resolveFoundItem
} from "../controllers/foundItemController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { memoryUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create found item (with images)
router.post(
  "/",
  protect,
  memoryUpload.array("images", 5),
  createFoundItem
);

// Get all found items (users)
router.get("/", protect, getAllFoundItems);

// Admin-only filtered list
router.get("/admin", protect, adminOnly, getFoundItems);

// Claim item
router.put("/:id/claim", protect, claimFoundItem);

// Admin actions
router.put("/:id/reject", protect, adminOnly, rejectClaim);
router.put("/:id/resolve", protect, adminOnly, resolveFoundItem);

export default router;