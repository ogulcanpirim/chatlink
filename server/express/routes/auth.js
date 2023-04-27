import { checkUser } from "../middleware/user.js";
import User from "../models/user.js";
import { Router } from "express";
const router = Router();
import crypto from "crypto";

//login
router.post("/login", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        status: 400,
        message: "User not found",
      });
    }
    if (user.password != req.body.password) {
      return res.send({
        status: 400,
        message: "Wrong password",
      });
    }
    res.send({
      status: 200,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register
router.post("/register", checkUser, async (req, res) => {
  if (res.user) {
    return res.send({
      status: 400,
      message: "User already exists",
    });
  }

  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.send({
      status: 400,
      message: "Please fill all fields",
    });
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
