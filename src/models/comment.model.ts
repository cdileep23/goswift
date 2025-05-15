import mongoose from "mongoose";



const commentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    postId: {
      type: Number,
      required: true,
    },
  }
);

export const commentModel = mongoose.model("Comment", commentSchema);
