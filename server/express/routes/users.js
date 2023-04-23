import { Router } from "express";
const router = Router();
import { getUser } from "../middleware/user.js";

//get user
router.get("/:id", getUser, (req, res) => {
  res.send(res.user);
});

//update user
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.send(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete user
router.delete("/:id", getUser, async (res) => {
  try {
    await res.user.remove();
    res.send({ message: "Deleted User" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
