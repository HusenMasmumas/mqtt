const mqtt = require("mqtt");

class MQTTService {
  constructor(host, messageCallback) {
    this.mqttClient = null;
    this.host = host;
    this.messageCallback = messageCallback;
  }

  connect() {
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.mqttClient = mqtt.connect(this.host, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: "emqx",
      password: "public",
      reconnectPeriod: 1000,
    });

    // MQTT Callback for 'error' event
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // MQTT Callback for 'connect' event
    this.mqttClient.on("connect", () => {
      console.log(`MQTT client connected`);
    });

    // Call the message callback function when message arrived

    this.mqttClient.on("message", function (topic, message) {
      console.log(message.toString());
      if (this.messageCallback) this.messageCallback(topic, message);
    });

    this.mqttClient.on("close", () => {
      console.log(`MQTT client disconnected`);
    });
  }

  // Publish MQTT Message
  publish(topic, message, options) {
    this.mqttClient.publish(topic, message);
  }

  // Subscribe to MQTT Message
  subscribe(topic, options, callback) {
    this.mqttClient.subscribe(topic, options, callback);
  }

  mqttSubscribe(topic, options, callback) {
    this.mqttClient.subscribe(topic, options);
    this.mqttClient.on("message", function (t, m) {
      if (t === topic) {
        callback(m.toString());
      }
    });
  }
}

module.exports = MQTTService;
