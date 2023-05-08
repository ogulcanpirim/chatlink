import { useEffect, useState } from "react";
import useSocket from "./useSocket";

type CheckUserOnlineHook = (id: string) => boolean;

const useCheckUserOnline: CheckUserOnlineHook = (id) => {
  const [online, setOnline] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("checkUserOnline", id);
      socket.on("online", (user_id) => {
        user_id === id && !online && setOnline(true);
      });
      socket.on("offline", (user_id) => {
        user_id === id && online && setOnline(false);
      });
    }
  }, [socket, id]);

  return online;
};

export default useCheckUserOnline;
