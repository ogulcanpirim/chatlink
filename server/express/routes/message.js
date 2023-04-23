import { Router } from "express";
const router = Router();
import Message from "../models/message.js";
import Chat from "../models/chat.js";
import { io } from "../server.js";

//all messages
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.find({ chat_id: req.params.id });
    res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//send message
router.post("/send/:id", async (req, res) => {
  if (Buffer.byteLength(req.body.content, "utf8") > 1000) {
    return res.status(400).json({ message: "Message too long" });
  }
  const newMessage = new Message({
    user_id: req.body.user_id,
    content: req.body.content,
    chat_id: req.params.id,
  });
  try {
    const updatedMessage = await newMessage.save();
    const chat = await Chat.findByIdAndUpdate(req.params.id, {
      latestMessage: updatedMessage,
    });
    chat.users.forEach((user) => {
      io.to(user._id.toString()).emit("message", updatedMessage);
    });
    res.status(200).json({ data: updatedMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
