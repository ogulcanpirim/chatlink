import { useEffect, useState } from "react";
import socket from "../utils/socket";

type CheckUserOnlineHook = (id: string) => boolean;

const useCheckUserOnline: CheckUserOnlineHook = (id) => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("checkUserOnline", id);
    }
  }, [socket, id]);

  useEffect(() => {
    if (socket) {
      socket.on("online", (user_id) => {
        user_id === id && !online && setOnline(true);
      });
      socket.on("offline", (user_id) => {
        user_id === id && online && setOnline(false);
      });
    }
  }, [socket, id, online]);

  return online;
};

export default useCheckUserOnline;
