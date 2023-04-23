import Chat from "../models/chat.js";

export async function getChat(req, res, next) {
  let chat;
  try {
    chat = await Chat.findById(req.params.id);
    if (chat === null) {
      return res.status(404).json({ message: "Cannot find chat" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.chat = chat;
  next();
}

export async function createChat(req, res, next) {
  let findChat;
  try {
    findChat = await Chat.findById(req.params.chatId);
    if (findChat === null) {
      const chat = new Chat({
        users: req.body.users,
      });
      const newChat = await chat.save();
      req.params.id = newChat._id;
      res.status(201).json(newChat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  next();
}

export async function getChatWithUser(req, res, next) {
  let chat;
  try {
    chat = await Chat.find({ users: { $all: [req.params.id] } }).populate(
      "users", "-password"
    ).populate("latestMessage");
    if (chat === null) {
      return res.status(404).json({ message: "Cannot find chat" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.chat = chat;
  next();
}
