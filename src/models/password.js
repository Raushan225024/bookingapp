const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
    lockerId: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    expireAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

// TTL Index
passwordSchema.index(
    { expireAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Password", passwordSchema);