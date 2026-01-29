import express from "express";
import {
  createLostItem,
  getAllLostItems
} from "../controllers/lostItemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createLostItem);
router.get("/all", protect, getAllLostItems);

export default router;
