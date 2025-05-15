import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({})
const URL = process.env.MONGO_DB_URL || ""
export const connectDB=async()=>{
    try {
       
        await mongoose.connect(URL);
        console.log("Connected to DataBase")
        
    } catch (error) {
        console.log(error)
    }
}