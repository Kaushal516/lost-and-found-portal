import express from "express";
import { getRecentActivity } from "../controllers/publicActivityController.js";

const router = express.Router();

router.get("/recent", getRecentActivity);

export default router;
