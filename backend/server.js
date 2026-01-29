import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import http from "http";
import setupSocket from "./socket/socket.js";

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

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});