// 🔥 LOAD ENV FIRST (ESM-safe)
import "dotenv/config";
configDotenv();

import express from "express";
import cors from "cors";
import http from "http";

// DB & Socket
import connectDB from "./db/connectDB.js";
import setupSocket from "./socket/socket.js";

// Routes
import userAuthRoutes from "./routes/userAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import lostItemRoutes from "./routes/lostItemRoutes.js";
import foundItemRoutes from "./routes/foundItemRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import userPostsRoutes from "./routes/userPostsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import publicActivityRoutes from "./routes/publicActivityRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import { configDotenv } from "dotenv";
import initializeCleanupJob from "./services/cleanupService.js";

const app = express();

/* =======================
   DATABASE
======================= */
connectDB();
initializeCleanupJob();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
   origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
   credentials: true
}));
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/api/users", userAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/lost", lostItemRoutes);
app.use("/api/found", foundItemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/my-posts", userPostsRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicActivityRoutes);

/* =======================
   SERVER + SOCKET
======================= */
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

setupSocket(server);

server.listen(PORT, () => {
   console.log(`✅ Server running on port ${PORT}`);
});
