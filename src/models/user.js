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

            bookedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    lockerCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

// Automatically update lockerCount
userSchema.pre("save", function (next) {
    this.lockerCount = this.lockers.length;
    next();
});

module.exports = mongoose.model("User", userSchema);