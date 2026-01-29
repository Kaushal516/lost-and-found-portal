import express from "express";
import { searchFoundItems } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/found", protect, searchFoundItems);

export default router;
