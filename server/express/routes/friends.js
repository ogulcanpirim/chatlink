import { Router } from "express";
import { io } from "../server";
const router = Router();

//get all friends
router.get("/:id", getUser, (req, res) => {
  res.send(res.friends);
});

//send friend request
router.post("/request/send", checkUsers, async (req, res) => {
  const { user_id, friend_id } = res.body;
  try {
    if (res.user.friends.includes(friend_id))
      return res.status(400).json({ message: "Friend already added" });
    else if (res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request already sent" });
    res.friend.pendingRequests.push(user_id);
    await res.friend.save();
    const userData = res.user.populate("-password, -friends, -pendingRequests");
    io.to(friend_id.toString()).emit("friendRequest", userData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//accept friend request
router.post("/request/accept", async (req, res) => {
  const { user_id, friend_id } = res.body;
  try {
    if (!res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request not found" });
    res.friend.pendingRequests = res.friend.pendingRequests.filter(
      (request) => request !== user_id
    );
    res.friend.friends.push(user_id);
    res.user.friends.push(friend_id);
    await res.friend.save();
    await res.user.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//reject friend request
router.post("/request/reject", async (req, res) => {
  const { user_id } = res.body;
  try {
    if (!res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request not found" });
    res.friend.pendingRequests = res.friend.pendingRequests.filter(
      (request) => request !== user_id
    );
    await res.friend.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//delete friend
router.delete("/", async (req, res) => {
  const { user_id, friend_id } = req.body;
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
