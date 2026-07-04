
const { verifyPasswordService } = require("../services/verifypassword");
exports.verifyPassword = async (req, res) => {
    try{
        const {lockerId, password} = req.body;
        // Call the service to verify password
        const result = await verifyPasswordService(lockerId, password);
        return res.status(200).json({
            success: true,
            message: "Password verified successfully",
            data: result
        });
    }
    catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.createOrder = async (req, res) => {
    
}