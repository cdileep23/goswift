import mongoose from "mongoose";
import { Post } from "../utils/constant";

const postSchema = new mongoose.Schema<Post>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    comments: [
      {
        id: {
          type: Number,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        body: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { _id: false }
);
export const postModel=mongoose.model<Post>('Post',postSchema)