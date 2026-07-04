const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Delete document 5 minutes after last update
otpSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 300 } // 5 minutes
);

module.exports = mongoose.model("Otp", otpSchema);