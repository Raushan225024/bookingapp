const TempPassword = require("../models/temppassword");

const saveTempPassword = async (phoneNumber, lockers, password) => {

    const result = await TempPassword.findOneAndUpdate({
        phoneNumber: phoneNumber
    },
        {lockers: lockers,
         password: password,
         expireAt: new Date(Date.now() + 10 * 60 * 1000)
        }, // Update expireAt to 10 minutes from now
        { new: true, upsert: true,  }
    );
    return result;
};

module.exports = { saveTempPassword };