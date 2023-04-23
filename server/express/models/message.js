import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    chat_id: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
