import { Router } from "express";
const router = Router();
import { getUser } from "../middleware/user.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/avatars/");
  },
  filename: (req, file, cb) => {
    const id = req.params.id;
    cb(null, `${id}-${Date.now()}-avatar` + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

//update avatar
router.patch(
  "/:id/update-avatar",
  upload.single("image"),
  getUser,
  async (req, res) => {
    const newAvatar = `${process.env.API_URL}/public/avatars/${req.file.filename}`;
    res.user.avatar = newAvatar;
    try {
      await res.user.save();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    res
      .status(200)
      .json({ data: { avatar: newAvatar, message: "Avatar updated." } });
  }
);

//delete avatar
router.delete("/:id/delete-avatar", getUser, async (req, res) => {
  res.user.avatar = null;
  try {
    await res.user.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  res.status(200).json({ data: { message: "Avatar deleted." } });
});

export default router;
