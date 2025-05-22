// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_SOCKET_URL;
const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server!", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server!");
});

export default socket; // Export the socket instance
