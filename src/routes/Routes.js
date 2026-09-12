const express = require("express");
const router = express.Router();
const JWTauth = require("../middlewares/JWTauth");
const controller1 = require("../controllers/verifyphone");
const controller2 = require("../controllers/verifypassword");

// Route to send OTP
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});
router.post("/send-otp", controller1.sendOTP);
router.post("/verify-otp", controller1.verifyOTP);
router.post("/verify-password", controller2.openLocker);
router.post("/create-order",JWTauth,controller1.createOrder);
router.post("/verify-payment",JWTauth,controller1.verifyPayment);
router.post("/user-lockers",JWTauth,controller1.getUserLockers);
router.post("/get-passwords",JWTauth,controller1.getPasswords);
module.exports = router;