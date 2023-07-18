const mqttService = require("../service/mqttService");
const client = require("../service/database");
const host = "mqtt-dashboard.com";
const port = "8884";
const MQTT_HOST_NAME = `wss://${host}:${port}/mqtt`;

var mqttClient = new mqttService(MQTT_HOST_NAME);
mqttClient.connect();

exports.getSubscriberPage = function (req, res) {
  try {
    const topic = "/test";

    mqttClient.mqttSubscribe(topic, { qos: 0 }, function (message) {
      client.query(
        `INSERT INTO mqtt_data (value) VALUES ($1)`,
        [message.toString()],
        (err, data) => {
          if (!err) {
            console.log("success");
          } else {
            console.log("eror ===>", err.message);
          }
        }
      );
    });

    client.query("SELECT * from mqtt_data", async (err, data) => {
      if (!err) {
        await res.status(200).json({
          status: 200,
          data: data?.rows || [],
        });
      } else {
        await res.status(400).json({
          status: 400,
          message: err.message,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: 400, message: "Error getting subscriber page" });
  }
};
