const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");

const socketAuth = require("./middlewares/socketauth");
const SocketConnection = require("./socket/connection");
const mqttClient = require("./mqtt/mqttclient");


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
require("./corn");
// Authentication Middleware
io.use(socketAuth);

SocketConnection(io);
async function startServer(){
    await connectDB();
    server.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}
startServer();