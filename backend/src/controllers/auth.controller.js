import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

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
    if (!emailregex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exist!" });
    const salt = await bcrypt.genSalt(10);
    const hashedPas = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPas,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else res.status(400).json({ message: "Invalid user data" });
  } catch (err) {
    console.log("Error in the signup controller ::", err.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
