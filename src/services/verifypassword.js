const bcripto = require("bcrypt");
const passwordRepo = require("../repo/passwordRepo");
const mqttClient = require("../mqtt/mqttclient");
const getGroup = require("../utils/getGroup");

exports.verifyPasswordService = async (lockerId, password) => {
    // Fetch user from DB
    const user = await passwordRepo.findLockerByLockerId(lockerId);
    if (!user) {
        throw new Error("Locker not found");
    }

    // Compare passwords
    const isMatch = await bcripto.compare(password, user.password);
    if (isMatch) {

         mqttClient.publish(
           `esp32/${getGroup(lockerId)}/open`,
             JSON.stringify({
             lockerId: lockerId,
             action: "OPEN"
            })
        );
        console.log(`Password verified for locker ${lockerId}. 
            MQTT message sent to open locker.`); 
    }

    return user;
};
