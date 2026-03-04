import { useEffect, useRef } from "react";
import socket from "../socket";

const useSocket = (userId) => {
  const socketRef = useRef(socket);

  useEffect(() => {
    if (!userId) return;

    socket.emit("setup", userId);

    return () => {
      // Don't disconnect here either since it's shared!
    };
  }, [userId]);

  return socketRef;
};

export default useSocket;
