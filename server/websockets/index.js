import mongoose from "mongoose";
import User from "../models/user.model.js";
import Player from "../models/player.model.js";
import Level from "../models/level.model.js";
import Game from "../models/game.model.js";
import GamePlayer from "../models/gamePlayer.model.js";

let arr1vs1 = [];
let playerStatus = {};

export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
      removePlayer(socket.id);
    });

    socket.on("leave_queue", () => {
      removePlayer(socket.id);
      playerStatus[socket.id] = "left";
    });

    socket.on("join_queue", async (data) => {
      if (playerStatus[socket.id] === "left") {
        playerStatus[socket.id] = "active";
        return;
      }

      socket.join(data.room);

      const alreadyInQueue = arr1vs1.some(
        (player) => player.socketId === socket.id,
      );

      if (!alreadyInQueue) {
        socket.join(data.room);

        try {
          // Verifica el ID del usuario
          const userId = data.userdata.id;
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("ID de usuario no es válido");
            return;
          }

          // Obtener datos completos de usuario, jugador y nivel
          const user = await User.findById(userId).populate({
            path: "player",
            populate: {
              path: "level",
            },
          });

          if (!user) {
            console.log("Usuario no encontrado con ID:", userId);
            return;
          }

          const playerData = user.player;
          const levelData = playerData.level;

          console.log("Datos del Usuario:", user);
          console.log("Datos del Jugador:", playerData);
          console.log("Datos del Nivel:", levelData);

          const challenger = {
            id: socket.id,
            username: user.username,
            avatar: user.avatar,
            bet: data.userdata.bet,
            room: data.room,
            socketId: socket.id,
          };

          arr1vs1.push(challenger);
          console.log("join queue", arr1vs1);

          matchPlayers();
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      } else {
        console.log("Jugador ya está en la cola");
      }

      matchPlayers();
    });

    socket.on("send_challenger", (data) => {
      socket.to(data.room).emit("received_challenger", data);
    });
  });
}

function removePlayer(socketId) {
  const index = arr1vs1.findIndex((socket) => socket.socketId === socketId);

  console.log("remove index:", index);
  if (index !== -1) {
    arr1vs1.splice(index, 1);
  }
  console.log(arr1vs1);
}

function matchPlayers() {
  if (arr1vs1.length >= 2) {
    const player1 = arr1vs1[0];
    const player2 = arr1vs1[1];

    arr1vs1.splice(0, 2);

    console.log(player1.username, "vs", player2.username);
  }
}
