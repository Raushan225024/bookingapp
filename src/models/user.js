const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String, // Phone Number
        required: true,
        unique: true,
        trim: true
    },

    lockers: [
        {
            lockerId: {
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ["available", "tempLock", "booked"],
                default: "booked"
            },
            bookedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    

}, {
    timestamps: true
});


module.exports = mongoose.model("User", userSchema);