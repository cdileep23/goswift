import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import { connectDB } from "./db";
import userRouter from './routes/user.route'
dotenv.config({})
const app = express();


app.use("/api", userRouter);
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello from Backend");
});


const startServer=async()=>{
  try {
    await connectDB()
    app.listen(9000, () => {
  
      console.log("Server started at http://localhost:9000");
    });
   
  
  } catch (error) {
    console.error("Database cannot be connected!!", error);
  }
}
startServer()