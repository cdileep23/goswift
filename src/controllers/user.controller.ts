import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { postModel } from "../models/post.model";
import { commentModel } from "../models/comment.model";
import axios from "axios";

import { Comment, Post, User } from "../utils/constant";


export const loadData = async (req:Request,res:Response):Promise<any> => {
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
    await commentModel.deleteMany();
console.log("deleted existing one");
    const comments: Comment[] = commentsResponse.data;
    await commentModel.insertMany(comments);
    console.log("completed comments");
    const users: User[] = usersResponse.data;
    await UserModel.insertMany(users);
console.log("completed User")
    const posts: Post[] = postsResponse.data.map((post: any) => {
      const postComments = commentsResponse.data
        .filter((comment: any) => comment.postId === post.id)
        .map(({ postId, ...rest }: any) => rest);

      return { ...post, comments: postComments };
    });

    await postModel.insertMany(posts);
console.log("completed post");
  return res.status(200).json({
    message: "Added Data to the Database",
    success: true,
  });
  } catch (err) {
    console.error("Error loading data:", err);
    return res.status(500).json({
        message:"Internal Server Error",
        success:false
    })
  }
};

type deleteUsers={
    success:boolean,
    message:string
}

export const deleteAllUsers=async(req:Request,res:Response):Promise<any>=>{
    try {
        const resposeUsers=await UserModel.deleteMany()
        const responsePosts=await postModel.deleteMany()
        const responseComments=await commentModel.deleteMany()
        return res.status(200).json({
            success:true,
            message:"Delete All Users With Posts &  Comments"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}
export const deleteUserByUserId=async(req:Request,res:Response):Promise<any>=>{
    try {
      const userId = parseInt(req.params.userId);
      const result = await UserModel.deleteOne({ id: userId });

      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "User not found", sucesss: false });
      }

     
      const userPosts = await postModel.find({ userId });

  
      await postModel.deleteMany({ userId });

      
      await commentModel.deleteMany({
        postId: { $in: userPosts.map((post: any) => post.id) },
      });
      return res.status(200).json({
        success:true,
        message:"Deleted User along with his posts and their comments"
      })
    } catch (error) {
         console.log(error);
         return res.status(500).json({
           message: "Internal Server Error",
           success: false,
         });
    }
}

export const getUserByUserId=async(req:Request,res:Response):Promise<any>=>{
    try {
        const userId=req.params.userId
       
        const userExists=await UserModel.findOne({id:userId})
     
        if(!userExists){
             return res
               .status(404)
               .json({ message: "User not found", sucesss: false });
        }

        const posts=await postModel.find({
            userId
        })

        return res.status(200).json({
            success:true,
            message:"Fetched Userdata successfully",
            data:{
                ...userExists,
                posts
            }
        })
         


    } catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "Internal Server Error",
            success: false,
          });
    }
}