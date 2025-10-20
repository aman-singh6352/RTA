import dotenv from 'dotenv';
import express from 'express'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from './routes/message.route.js';
import path from 'path';
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist", "index.html"));
    })
}

const PORT = process.env.PORT || 3000;
const app = express();
const __dirname = path.resolve();

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT, () => console.log("Server is listening on the port", PORT));
  