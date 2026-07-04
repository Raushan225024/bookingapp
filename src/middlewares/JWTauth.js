const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Token header se nikaalo
    const authHeader = req.headers.authorization;

    // authHeader format: "Bearer token"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing!",
      });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ req.user me decoded payload store
    req.user = decoded; // { userId, phone, iat, exp }

    next(); // ✅ allow request
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;

