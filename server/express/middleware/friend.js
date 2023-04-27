import User from "../models/user.js";

export async function checkUserTags(req, res, next) {
  const { user_tag, friend_tag } = req.body;
  let user = null,
    friend = null;
  try {
    user = await User.findOne({ tag: user_tag });
    friend = await User.findOne({ tag: friend_tag });
    if (!user || !friend)
      return res.status(404).json({ message: "User or friend not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  res.friend = friend;
  next();
}
