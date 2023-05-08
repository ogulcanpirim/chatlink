import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL;
let socket: Socket | null = null;

const useSocket = (): Socket => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!socket) {
      socket = io(socketURL, {
        query: {
          user: user?._id,
        },
      });
      socket.on("connect", () => {
        console.log("socket connected");
        socket?.emit("setup", userData);
      });
      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
    }
    return () => {
      socket?.close();
      socket = null;
    };
  }, []);

  return socket as Socket;
};

export default useSocket;
