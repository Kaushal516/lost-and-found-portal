import io from "socket.io-client";

// Initialize socket connection
// Adjust URL if backend is on different port/host
const socket = io("http://localhost:5000", {
    withCredentials: true,
    autoConnect: true,
});

export default socket;
