import { Server } from "socket.io";
import { setIO } from "./ioInstance.js";

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