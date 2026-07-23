const Password = require("../models/password");
const mqttClient = require("../mqtt/mqttclient");

exports.openLocker = async (req, res) => {
  try {
    const { lockerId, password } = req.body;

    // Password verify
    const locker = await Password.findOne({
      lockerId,
      password,
    });

    if (!locker) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
     const device = (lockerId) =>
  lockerId <= 20 ? 1 : Math.ceil((lockerId - 20) / 10) + 1;
    // Publish MQTT command
    mqttClient.publish(
      `locker/ESP32_${device}/command`,
      JSON.stringify({
        lockerId,
        command: "unlock",
      }),
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Failed to send MQTT command",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Unlock command sent successfully",
        });
      }
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
