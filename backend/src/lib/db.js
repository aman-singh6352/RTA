import mongoose from "mongoose";
import "dotenv/config";
export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully!");
  } catch (err) {
    console.log("The Error in connection ::", err);
    process.exit(1);
  }
};
