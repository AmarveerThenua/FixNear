import { io } from "socket.io-client";

let socket = null;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const getHelpSocket = () => {
  const token = localStorage.getItem("fixnearToken");

  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectHelpSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};