const Handler = require("./sockethandler");
function SocketConnection(io) {
    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);
        Handler.LockerHandler(socket,io);
        Handler.TempLockHandler(socket,io);
        Handler.UnlockTempLockHandler(socket,io);
       // Handler.BookedHandler(socket,io);
       // Handler.AvailableLockHandler(socket,io);

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        });

    });
}
module.exports = SocketConnection;