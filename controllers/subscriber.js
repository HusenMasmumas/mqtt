const mqttService = require("../service/mqttService");
const host = "mqtt-dashboard.com";
const port = "8884";
const MQTT_HOST_NAME = `wss://${host}:${port}/mqtt`;

var mqttClient = new mqttService(MQTT_HOST_NAME);
mqttClient.connect();

exports.getSubscriberPage = function (req, res) {
  try {
    const topic = "/test";

    mqttClient.mqttSubscribe(topic, { qos: 0 }, function (message) {
      console.log("message ===============> ", message);
    });

    res.status(200).json({
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: 400, message: "Error getting subscriber page" });
  }
};
