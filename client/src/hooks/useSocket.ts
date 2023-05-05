import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL;

const useSocket = (): [Socket | null, boolean] => {
  const newSocket = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    newSocket.current = io(socketURL);
    setSocket(newSocket.current);
    return () => {
      newSocket.current?.close();
    };
  }, [socketURL]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setConnected(true);
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });
    }
  }, [socket]);

  return [socket, connected];
};

export default useSocket;
