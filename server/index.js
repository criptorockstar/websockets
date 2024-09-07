import "dotenv/config";
import express from "express";
import logger from "morgan";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import setupSocket from "./websockets/index.js";
import mainRoutes from "./routes/routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRoutes);
app.use("/api", userRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

async function startServer() {
  try {
    await mongoose.connect("mongodb://localhost:27017/pericon");
    console.log("connected to mongoDB");

    setupSocket(io);

    server.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

startServer();
