export default function setupQueueEvents(socket) {
  socket.on("join_queue", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined queue ${data}`);
  });

  socket.on("send_challenger", (data) => {
    socket.to(data.room).emit("received_challenger", data);
  });
}
