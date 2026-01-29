import express from "express";
import {
  getAllUsers,
  getLostItemsWithContact,
  getFoundItemsWithContact
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only routes
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/lost-items", protect, adminOnly, getLostItemsWithContact);
router.get("/found-items", protect, adminOnly, getFoundItemsWithContact);

export default router;
