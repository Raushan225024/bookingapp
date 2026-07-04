const mongoose = require("mongoose");

const temppasswordSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    lockers: [{
        type: String,
        required: true,
        unique: true
    }],

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
temppasswordSchema.index(
    { expireAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("TempPassword", temppasswordSchema);