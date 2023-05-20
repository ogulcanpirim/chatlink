import io from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL;
const userData = localStorage.getItem("user");
const user = userData ? JSON.parse(userData) : null;

const socket = io(socketURL, {
  query: {
    user: user?._id,
  },
});

socket.on("connect", () => {
  console.log("socket connected");
});
socket.on("disconnect", () => {
  console.log("socket disconnected");
});

export default socket;
