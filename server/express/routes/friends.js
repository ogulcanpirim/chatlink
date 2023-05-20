import { Router } from "express";
import { io } from "../server.js";
import { getUser } from "../middleware/user.js";
import { checkUserTags } from "../middleware/friend.js";
import Chat from "../models/chat.js";
import { Types } from "mongoose";

const router = Router();

//get all friends
router.get("/:id", getUser, (req, res) => {
  res.send(res.friends);
});

//get all pending requests
router.get("/pending/:id", getUser, (req, res) => {
  res.send(res.pendingRequests);
});

//send friend request
router.post("/request/send", checkUserTags, async (req, res) => {
  const user_id = res.user._id;
  const friend_id = res.friend._id;
  try {
    if (res.user.friends.includes(friend_id))
      return res.status(400).json({ message: "Friend already added." });
    else if (res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request already sent." });
    res.friend.pendingRequests.push(user_id);
    await res.friend.save();
    const userData = {
      _id: res.user._id,
      email: res.user.email,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
      avatar: res.user.avatar,
      tag: res.user.tag,
    };
    io.to(friend_id.toString()).emit("friendRequest", userData);
    return res.status(200).json({ message: "Friend request sent." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//accept friend request
router.post("/request/accept", checkUserTags, async (req, res) => {
  const user_id = res.user._id;
  const friend_id = res.friend._id;
  try {
    if (!res.user.pendingRequests.includes(friend_id))
      return res.status(400).json({ message: "Friend request not found" });
    res.user.pendingRequests = res.user.pendingRequests.filter(
      (request) => request.toString() !== friend_id.toString()
    );
    res.friend.friends.push(user_id);
    res.user.friends.push(friend_id);
    const newChat = new Chat({
      users: [new Types.ObjectId(user_id), new Types.ObjectId(friend_id)],
    });
    const savedChat = await newChat.save();
    const chat = await savedChat.populate("users", "-password");
    await res.friend.save();
    await res.user.save();
    io.to(friend_id.toString()).emit("newChat", {
      chat,
      name: `${res.user.firstName} ${res.user.lastName}`,
    });
    return res.status(200).json({
      data: {
        friend_id: friend_id.toString(),
        chat,
        message: "Friend request accepted.",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//reject friend request
router.post("/request/reject", checkUserTags, async (req, res) => {
  const friend_id = res.friend._id;
  try {
    res.user.pendingRequests = res.user.pendingRequests.filter(
      (request) => request.toString() !== friend_id.toString()
    );
    await res.user.save();
    return res
      .status(200)
      .json({ data: { friend_id, message: "Friend request rejected." } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//delete friend
router.delete("/", checkUserTags, async (req, res) => {
  const user_id = res.user._id;
  const friend_id = res.friend._id;
  try {
    if (!res.user.friends.includes(friend_id))
      return res.status(400).json({ message: "Friend not found" });
    res.user.friends = res.user.friends.filter(
      (friend) => friend !== friend_id
    );
    res.friend.friends = res.friend.friends.filter(
      (friend) => friend !== user_id
    );
    await res.user.save();
    await res.friend.save();
    return res.status(200).json({ data: friend_id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
