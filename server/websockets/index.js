export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.id}`);
    });

    socket.on("join_queue", (data) => {
      socket.join(data);
      console.log(`User ${socket.id} joined queue ${data}`);
    });

    socket.on("send_challenger", (data) => {
      socket.to(data.room).emit("received_challenger", data);
    });
  });
}
