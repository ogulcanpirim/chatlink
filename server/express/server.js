import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";
import friendRouter from "./routes/friends.js";
import { Server } from "socket.io";
import { delay } from "./middleware/pause.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
mongoose.connect("mongodb://localhost:2717", {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connected to MongoDB");
});

const app = express();

console.log(process.env.NODE_ENV);

const env = process.env.NODE_ENV || "development";
if (env === "development") {
  app.use(delay);
}
//test account(s)...
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(
  "/public/avatars",
  express.static(path.join(__dirname, "../public/avatars"))
);

export const io = new Server(3001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    const user = JSON.parse(userData);
    if (user) {
      socket.join(user._id);
    }
  });

  //typing
  socket.on("typing", (data) => {
    const typingUser = data.user_id.toString();
    const typeData = {
      chat_id: data.chat_id,
      user_id: typingUser,
    };
    data.users.forEach((user) => {
      if (user !== typingUser) {
        socket.to(user.toString()).emit("typing", typeData);
      }
    });
  });
  socket.on("stop typing", (data) => {
    socket.in(data).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});

app.use("/user", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/friend", friendRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
