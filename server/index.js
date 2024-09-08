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

import Level from "./models/level.model.js";
// Populate database if empty
const levels = [
  {
    name: "Aprendiz",
    min_bet: 10,
    free_claims: 1,
    badge: "http://localhost:3001/badges/beginner.png",
  },
  {
    name: "Novato",
    min_bet: 25,
    free_claims: 2.5,
    badge: "http://localhost:3001/badges/novice.png",
  },
  {
    name: "Maestro",
    min_bet: 50,
    free_claims: 5,
    badge: "http://localhost:3001/badges/master.png",
  },
];

const cardNumbers = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
const suits = {
  gold: "gold",
  cups: "cups",
  swords: "swords",
  clubs: "clubs",
};

async function seedLevels() {
  const count = await Level.countDocuments();
  if (count === 0) {
    await Level.insertMany(levels);
    console.log("Seed de niveles completado");
  } else {
    console.log("La colección de niveles ya tiene datos");
  }
}

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

    // Ejecutar el seed de niveles si es necesario
    await seedLevels();

    setupSocket(io);

    server.listen(process.env.PORT || 3001, () => {
      console.log(`Server running on port ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

startServer();
