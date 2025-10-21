import mongoose from "mongoose";
export const connectDB = () => {
  try{
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully!");
  } catch(err) {
    console.log("The Error in connection ::", err);
    process.exit(1);
  }
};
console.log(process.env.MONGODB_URL);
