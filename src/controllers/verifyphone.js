const { sendOtpService, verifyOtpService } = require("../services/otpservice");
const { saveTempPassword } = require("../repo/tempPasswordRepo");
const TempPassword = require("../models/temppassword");
const Password = require("../models/password");
const Locker = require("../models/locker");
const User = require("../models/user");

const Razorpay = require("razorpay");
const crypto = require("crypto");

// send OTP controller

exports.sendOTP = async (req, res) => {
    try {
        const result = await sendOtpService(req.body.phone);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
//verify OTP controller
exports.verifyOTP = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body);
    console.log("OTP verification result:", result);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: result
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


//payment integration controller


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { lockers, password } = req.body;
    const user = req.user.phoneNumber; // Get user data from JWT middleware
    const temppassword = await saveTempPassword(user, lockers, password);
    const options = {
      amount: lockers.length * 50 *100, // rupees -> paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
const phoneNumber = req.user.phoneNumber; // Get user data from JWT middleware
    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
    const tempDoc = await TempPassword.findOne({ phoneNumber });

    if (!tempDoc) {
      return res.status(404).json({
        success: false,
        message: "Temporary password not found"
      });
    }

    // Step 2: Copy each locker password into Password collection
    await Promise.all(
      tempDoc.lockers.map((lockerId) =>
        Password.findOneAndUpdate(
          { lockerId },
          {
            $set: {
              lockerId,
              password: tempDoc.password,
              expireAt: tempDoc.expireAt,
            },
          },
          {
            upsert: true,
            new: true,
          }
        )
      )
    );
//  finnal update of locker status templock to booked
await Promise.all(
  tempDoc.lockers.map((lockerId) =>
    Locker.findOneAndUpdate(
      { lockId: lockerId, status: "tempLock" },
      { status: "booked" },
      { new: true }
    )
  )
);
await User.findOneAndUpdate(
  { userId: tempDoc.phoneNumber },
  { $push: { lockers: { $each: tempDoc.lockers.map(lockerId => ({ lockerId, status: "booked" })) } } },
  {  
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true
     }
);
    // Payment verified
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
// user lockers controller
exports.getUserLockers = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.phoneNumber });
    console.log("User lockers retrieved:", user);
    return res.status(200).json({
      success: true,
      user : user ,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user lockers",
    });
  }}
  // get passwords controller
  exports.getPasswords = async (req, res) => {
    console.log("get password by sms");
  }