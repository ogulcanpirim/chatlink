import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    avatar: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default model("User", userSchema);
