let arr1vs1 = [];
let playingArray = [];
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

    socket.on("join_queue", (data) => {
      if (playerStatus[socket.id] === "left") {
        playerStatus[socket.id] = "active";

        return;
      }

      socket.join(data.room);

      // store in hashmap
      const alreadyInQueue = arr1vs1.some(
        (player) => player.socketId === socket.id,
      );

      if (!alreadyInQueue) {
        socket.join(data.room);

        const challenger = {
          id: socket.id,
          username: data.userdata.username,
          email: data.userdata.email,
          room: data.room,
          socketId: socket.id,
        };

        // Agrega al jugador a la cola si no está ya en la cola
        arr1vs1.push(challenger);
        console.log("join queue", arr1vs1);

        // Realiza el emparejamiento de jugadores
        matchPlayers();
      } else {
        console.log("Jugador ya está en la cola");
      }

      // maching players
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
