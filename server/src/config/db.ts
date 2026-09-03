import mongoose from "mongoose";
import { env } from "./env.js";


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI as string);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("mongoDB connection failed", err);
    process.exit(1);
  }
}