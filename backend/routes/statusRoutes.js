import express from "express";
import {
  claimFoundItem,
  resolveFoundItem,
  resolveLostItem
} from "../controllers/statusController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * USER ACTION
 */
router.put("/found/:itemId/claim", protect, claimFoundItem);

/**
 * ADMIN ACTIONS
 */
router.put("/found/:itemId/resolve", protect, adminOnly, resolveFoundItem);
router.put("/lost/:itemId/resolve", protect, adminOnly, resolveLostItem);

export default router;
