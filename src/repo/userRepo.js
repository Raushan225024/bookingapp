
const otpstor = require("../models/otpstorage");
exports.saveOtp = async (phone, otp) => {
  try {
    const user = await otpstor.findOneAndUpdate(
      { phoneNumber: phone }, // search condition
      {
        phoneNumber: phone,
        otp: otp,
      },
      {
        new: true,      // return updated document
        upsert: true ,
        setDefaultsOnInsert: true   // create if not exists
      }
    );
    console.log("DB RESULT:", user);
    console.log("OTP saved to DB for phone");
    return user;
  } catch (error) {
    throw error;
  }
};

exports.findByPhone = async (phone) => {
  try {
    return await otpstor.findOne({ phoneNumber: phone });
  } catch (error) {
    throw error;
  }
};

exports.deleteOTP = async (phone) => {
  try {
    const result = await otpstor.findOneAndDelete({ phoneNumber: phone });
    console.log("OTP deleted from DB for phone:", phone);
    return result;
  } catch (error) {
    throw error;
  }
};


