import express from "express";
import {
  createLostItem,
  getAllLostItems,
  getLostItems,
  resolveLostItem
} from "../controllers/lostItemController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { memoryUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  memoryUpload.array("images", 5),
  createLostItem
);

router.get("/", protect, getAllLostItems);

// Admin routes
router.get("/admin", protect, adminOnly, getLostItems);
router.put("/:id/resolve", protect, adminOnly, resolveLostItem);

export default router;
