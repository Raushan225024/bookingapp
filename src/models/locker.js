const mongoose = require("mongoose");

const lockSchema = new mongoose.Schema({
  
    lockId: {
      type: String,
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["available", "tempLock", "booked"],
      default: "available"
    },
  },
  {
    timestamps: true
  }

 


);

module.exports = mongoose.model("Lock", lockSchema);