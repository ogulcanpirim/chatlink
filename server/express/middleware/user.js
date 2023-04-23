import User from "../models/user.js";

export async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

export async function checkUser(req, res, next) {
  let user = null;
  try {
    user = await User.findById(req.params.id);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

export async function checkUsers(req, res, next) {
  const { user_id, friend_id } = req.body;
  let user, friend;
  try {
    friend = await User.findById(friend_id);
    user = await User.findById(user_id);
    if (!user || !friend)
      return res.status(404).json({ message: "User or friend not found" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  res.friend = friend;
  next();
}
