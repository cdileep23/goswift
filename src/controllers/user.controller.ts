import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { postModel } from "../models/post.model";
import { commentModel } from "../models/comment.model";
import axios from "axios";

import { Comment, Post, User } from "../utils/constant";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 10 });

interface Params {
  userId: string;
}

interface UserWithPosts extends User {
  posts?: Post[];
}
interface usersArray {
  users: UserWithPosts[];
  message: string;
  success: true;

  total: number;
  page: number;
  limit: number;
}

interface SuccessResponse {
  message: string;
  success: true;
  data: UserWithPosts;
}

interface ErrorResponse {
  message: string;
  success: false;
}

export const getUserByUserId = async (
  req: Request<Params>,
  res: Response<SuccessResponse | ErrorResponse>
): Promise<any> => {
  try {
    const userId = req.params.userId;
    const cacheKey = `user-${userId}`;

    const userExists = await UserModel.findOne({ id: parseInt(userId) });
    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const cachedUser = cache.get<UserWithPosts>(cacheKey);

    if (cachedUser) {
      return res.status(200).json({
        success: true,
        message: "Fetched User data successfully (from cache)",
        data: cachedUser,
      });
    }

    const posts = await postModel.find({ userId: parseInt(userId) });

    const data = {
      ...userExists,
      posts,
    };

    cache.set(cacheKey, data);

    return res.status(200).json({
      success: true,
      message: "Fetched User data successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const loadData = async (
  req: Request<{}, {}, {}, {}>,
  res: Response<{ message: string; success: boolean }>
): Promise<any> => {
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

   

    const comments: Comment[] = commentsResponse.data;
    await commentModel.insertMany(comments);
    console.log("Inserted comments");

    const users: User[] = usersResponse.data;
    await UserModel.insertMany(users);
    console.log("Inserted users");

    const posts: Post[] = postsResponse.data.map((post: any) => {
      const postComments = commentsResponse.data
        .filter((comment: any) => comment.postId === post.id)
        .map(({ postId, ...rest }: any) => rest);

      return { ...post, comments: postComments };
    });

    await postModel.insertMany(posts);
    console.log("Inserted posts");

    return res.status(200).json({
      message: "Added Data to the Database",
      success: true,
    });
  } catch (err) {
    console.error("Error loading data:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const deleteAllUsers = async (
  req: Request,
  res: Response<{ message: String; success: boolean }>
): Promise<any> => {
  try {
    const resposeUsers = await UserModel.deleteMany();
    const responsePosts = await postModel.deleteMany();
    const responseComments = await commentModel.deleteMany();
    return res.status(200).json({
      success: true,
      message: "Delete All Users With Posts &  Comments",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const deleteUserByUserId = async (
  req: Request<Params>,
  res: Response<{ message: String; success: boolean }>
): Promise<any> => {
  try {
    const userId = parseInt(req.params.userId);
    const result = await UserModel.deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const userPosts = await postModel.find({ userId });

    await postModel.deleteMany({ userId });

    await commentModel.deleteMany({
      postId: { $in: userPosts.map((post: any) => post.id) },
    });
    return res.status(200).json({
      success: true,
      message: "Deleted User along with his posts and their comments",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const addUser = async (
  req: Request<{}, {}, User>,
  res: Response<ErrorResponse | SuccessResponse>
): Promise<any> => {
  try {
    const { id } = req.body;
    const userExists = await UserModel.findOne({ id });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Id already exists",
      });
    }
    const newUser = await UserModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error loading data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getUsers = async (
  req: Request<
    {},
    {},
    {},
    {
      page?: string;
      limit?: string;
      sortBy?: string;
      postSortBy?: string;
     
    }
  >,
  res: Response<ErrorResponse | usersArray>
): Promise<any> => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "2");
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "name";
   
    const postSortBy = req.query.postSortBy || "title";

    const total = await UserModel.countDocuments();

    const users = await UserModel.find()
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(limit)
      .lean(); 

    const usersWithPosts: UserWithPosts[] = await Promise.all(
      users.map(async (user) => {
        const posts = await postModel
          .find({ userId: user.id })
          .sort({ [postSortBy]: 1 })
          .lean(); 
        return { ...user, posts };
      })
    );

    return res.status(200).json({
      message: "Users with their posts fetched successfully",
      success: true,
      users: usersWithPosts,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
