import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All field are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least of 6 characters" });

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    email.trim().toLowerCase();
    if (!emailregex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exist!" });
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPass,
    });
    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      try{
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
      }
      catch(err){
        console.log("Error in auth.controller.js to send an email::", err.message);
      }
    } else res.status(400).json({ message: "Invalid user data" });
  } catch (err) {
    if (err?.code === 11000 && (err.keyPattern?.email || err.keyValue?.email)) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Internal server error" + err.message });
  }
};
