import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const protectedRoute = async (req, res, next) => {
  try {
    // user must have a token or exist
    const token = req.cookies.jwt;
    if (!token) return res.redirect("/api/auth/login");

    // user's token must be verified not manipulated
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.redirect("/api/auth/login");

    // user must be authorised don't send the password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.redirect("/api/auth/login");
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in the :: protectedRoute", err.message);
  }
};
