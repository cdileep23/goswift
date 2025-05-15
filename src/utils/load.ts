import axios from "axios";
import { UserModel } from "../models/user.model";
import { postModel } from "../models/post.model";
import { Comment, Post, User } from "./constant";
import { commentModel } from "../models/comment.model";

const loadData = async () => {
  try {
    const usersResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const postsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const commentsResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );

    await UserModel.deleteMany();
    await postModel.deleteMany();
    await commentModel.deleteMany()

    const comments:Comment[]=commentsResponse.data
    await commentModel.insertMany(comments)
    const users: User[] = usersResponse.data;
    await UserModel.insertMany(users);

    const posts: Post[] = postsResponse.data.map((post: any) => {
      const postComments = commentsResponse.data
        .filter((comment: any) => comment.postId === post.id)
        .map(({ postId, ...rest }: any) => rest); 

      return { ...post, comments: postComments };
    });

    await postModel.insertMany(posts);

    console.log("Data loaded successfully!");
  } catch (err) {
    console.error("Error loading data:", err);
  }
};

export default loadData;
