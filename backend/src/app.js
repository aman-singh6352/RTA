import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.listen(PORT, () => {
  console.log("Server is listening on the port:", PORT);
  connectDB();
});
