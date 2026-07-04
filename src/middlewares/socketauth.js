const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    try {
        //const token = socket.handshake.auth.token;
        const token =
  socket.handshake.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new Error("Token not provided"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // User data socket me attach kar do
        socket.user = decoded;

        next();

    } catch (err) {
        next(new Error("Invalid Token"));
    }
};

module.exports = socketAuth;