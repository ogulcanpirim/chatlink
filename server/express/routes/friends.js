import { Router } from "express";
import { io } from "../server.js";
import { getUser } from "../middleware/user.js";
import { checkUserTags } from "../middleware/friend.js";

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
  console.log("user_id:", user_id);
  console.log("comes here...");
  console.log("res.user.friends:", res.user.friends);
  try {
    console.log("res.friend.pendingRequests:", res.friend.pendingRequests);
    console.log(
      "res.friend.pendingRequests.includes(user_id):",
      res.friend.pendingRequests.includes(user_id)
    );
    if (res.user.friends.includes(friend_id))
      return res.status(400).json({ message: "Friend already added" });
    else if (res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request already sent" });
    console.log("will push friend....");
    res.friend.pendingRequests.push(user_id);
    console.log("will save friend....");
    await res.friend.save();
    console.log("res.user: ", res.user);
    const userData = {
      _id: res.user._id,
      email: res.user.email,
      firstName: res.user.firstName,
      lastName: res.user.lastName,
    };
    io.to(friend_id.toString()).emit("friendRequest", userData);
    return res.status(200).json({ data: friend_id });
  } catch (error) {
    console.log("error: ", error.message);
    return res.status(500).json({ message: error.message });
  }
});

//accept friend request
router.post("/request/accept", checkUserTags, async (req, res) => {
  const user_id = res.user._id;
  const friend_id = res.friend._id;
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
    return res.status(200).json({ data: friend_id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//reject friend request
router.post("/request/reject", checkUserTags, async (req, res) => {
  const user_id = res.user._id;
  const friend_id = res.friend._id;
  try {
    if (!res.friend.pendingRequests.includes(user_id))
      return res.status(400).json({ message: "Friend request not found" });
    res.friend.pendingRequests = res.friend.pendingRequests.filter(
      (request) => request !== user_id
    );
    await res.friend.save();
    return res.status(200).json({ data: friend_id });
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
