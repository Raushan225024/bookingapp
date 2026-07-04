const generateOTP = require("../utils/generateotp");
const userRepository = require("../repo/userRepo");
const jwt = require("jsonwebtoken");


exports.sendOtpService = async (phone) => {
  const otp =  generateOTP();

  // save in DB (repository call)
  await userRepository.saveOtp(phone, otp);

  // SMS / Email service yahan call hogi
  console.log(`OTP sent to ${phone}: ${otp}`);

  return { phone, otp };
};
//const authRepo = require("./auth.repository");
// Function to verify OTP
exports.verifyOtpService = async ({ phone, otp }) => {
  if (!phone || !otp) {
    throw new Error("Phone and OTP are required");
  }

  const user = await userRepository.findByPhone(phone);

  if (!user) {
    return "User not found";
  }

  if (user.otp !== otp) {
    return "Invalid OTP";
  }

  const otpAgeMs = Date.now() - new Date(user.updatedAt).getTime();
  if (otpAgeMs > 5 * 60 * 1000) {
    return "OTP expired";
  }

  console.log("Before update");
  const token = jwt.sign({ phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("Generated JWT token:", token);
  const xyz = await userRepository.deleteOTP(user.phoneNumber);
  console.log("Updated user:", xyz);
   
  
  return {
    phoneNumber: user.phone,
    xyz,
    token,

  };
};
