import express from "express";
import { getUserProfile, updateUserProfile, requestDeletion } from "../controllers/userProfileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post("/profile/deletion-request", protect, requestDeletion);

export default router;
