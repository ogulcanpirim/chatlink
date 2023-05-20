import { checkUser } from "../middleware/user.js";
import User from "../models/user.js";
import { Router } from "express";
import crypto from "crypto";
const router = Router();

//login
router.post("/login", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email }).populate(
      "pendingRequests",
      "-password"
    );
    if (!user || user.password != req.body.password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register
router.post("/register", checkUser, async (req, res) => {
  if (res.user) {
    return res.status(400).json({ message: "User already exists." });
  }
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const userCheck = await User.findOne({ email: req.body.email });

  if (userCheck) {
    return res.status(400).json({ message: "User already exists." });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tag: crypto.randomBytes(3).toString("hex").toUpperCase(),
  });
  try {
    const newUser = await user.save();
    res.status(201).json({ data: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
