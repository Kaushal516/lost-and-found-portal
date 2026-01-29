import express from "express";
import {
  createFoundItem,
  getFoundItems
} from "../controllers/foundItemController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * USER: create found item
 */
router.post("/", protect, createFoundItem);

/**
 * ADMIN: get found items (optionally by status)
 */
router.get("/", protect, adminOnly, getFoundItems);

export default router;

