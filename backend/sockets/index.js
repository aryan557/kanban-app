module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Listen for task events, emit updates, handle conflicts here
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}; 