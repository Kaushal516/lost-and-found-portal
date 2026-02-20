import { Server } from "socket.io";
import { setIO } from "./ioInstance.js";

const userSocketMap = {}; // userId -> socketId

/**
 * Get count of unique online users
 */
export const getOnlineUsersCount = () => {
  return Object.keys(userSocketMap).length;
};

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // replace with frontend URL later
      methods: ["GET", "POST"]
    }
  });

  // Store global io instance
  setIO(io);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /**
     * Join User Room (for notifications)
     */
    socket.on("setup", (userData) => {
      if (!userData?._id) return;
      socket.join(userData._id);

      // Track online status
      userSocketMap[userData._id] = socket.id;

      socket.emit("connected");
    });

    /**
     * Join chat room
     * Each chatId = one room
     */
    socket.on("joinChat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
      console.log(`Joined chat room: ${chatId}`);
    });

    /**
     * Leave chat room (optional)
     */
    socket.on("leaveChat", (chatId) => {
      if (!chatId) return;
      socket.leave(chatId);
      console.log(`Left chat room: ${chatId}`);
    });

    /**
     * Disconnect
     */
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Remove user from map
      // Note: This is efficient enough for small scale. 
      // For large scale, we store socketId->userId reverse map or loop.
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });

    socket.on("typing", (chatId) => {
      socket.in(chatId).emit("typing");
    });

    socket.on("stopTyping", (chatId) => {
      socket.in(chatId).emit("stopTyping");
    });
  });
};

export default setupSocket;