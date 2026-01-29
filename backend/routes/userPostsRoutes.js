import express from "express";
import {
  getMyLostItems,
  getMyFoundItems
} from "../controllers/userPostsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/lost", protect, getMyLostItems);
router.get("/found", protect, getMyFoundItems);

export default router;
