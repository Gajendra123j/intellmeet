import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
