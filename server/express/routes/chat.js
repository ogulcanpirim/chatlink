import { Router } from "express";
import { getChat, getChatWithUser } from "../middleware/chat.js";
import Chat from "../models/chat.js";
const router = Router();
import { Types } from "mongoose";

//delete chat
router.delete("/:id", getChat, async (req, res) => {
  try {
    await res.chat.remove();
    res.send({ message: "Deleted Chat" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//create chat with user_id(s)
router.post("/create", async (req, res) => {
  const chat = new Chat({
    users: [
      new Types.ObjectId(req.query.s_id),
      new Types.ObjectId(req.query.u_id),
    ],
  });
  try {
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get chat with user_id
router.get("/:id", getChatWithUser, (req, res) => {
  res.status(200).json({ data: res.chat });
});

export default router;
