import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    socketRef.current.emit("setup", userId);

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  return socketRef;
};

export default useSocket;
