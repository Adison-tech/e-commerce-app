const { Server } = require("socket.io");

const initSocketIO = (server) => {
    // You must allow CORS for your frontend's URL during development.
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5015", // Your Vite frontend's URL
            methods: ["GET", "POST"]
        }
    });

    // Handle a new client connection
    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);

        // Example: Listen for a 'chat message' event from the client
        socket.on('chat message', (msg) => {
            console.log(`message: ${msg}`);
            // Broadcast the message to all connected clients
            io.emit('chat message', msg);
        });

        // Handle a client disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });

    return io;
};

module.exports = initSocketIO;