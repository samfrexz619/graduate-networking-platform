import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("mongoDB connection failed", err);
    process.exit(1);
  }
}