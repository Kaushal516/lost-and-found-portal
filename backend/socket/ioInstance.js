let ioInstance = null;

/**
 * Store socket.io instance
 */
export const setIO = (io) => {
  ioInstance = io;
};

/**
 * Get socket.io instance anywhere in app
 */
export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io instance not initialized");
  }
  return ioInstance;
};