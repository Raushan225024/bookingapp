const lockerPasword = require("../models/password");

exports.findLockerByLockerId = async (lockerId) => {
    return await lockerPasword.findOne({ lockerId: lockerId });
};
