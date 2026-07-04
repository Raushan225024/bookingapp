const mqtt = require("mqtt");

// Broker se connect
const mqttClient = mqtt.connect("mqtt://localhost:1883", {
  connectTimeout: 5000,
  reconnectPeriod: 5000,
});

mqttClient.on("connect", () => {
  console.log("MQTT Connected");
});

mqttClient.on("reconnect", () => {
  console.log("MQTT reconnecting...");
});

mqttClient.on("error", (err) => {
  console.warn("MQTT Error:", err.message || err);
});

mqttClient.on("offline", () => {
  console.warn("MQTT is offline. Broker may be unavailable.");
});
module.exports = mqttClient;