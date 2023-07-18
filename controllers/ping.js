const exec = require("child_process").exec;

const location = "192.168.1.27";

const pingFunction = async function () {
  const promises = [];

  promises.push(
    await new Promise((resolve, reject) => {
      exec(`ping -c 3 -W 1000 ${location}`, (err, stdout, stderr) => {
        let status = "offline";
        let output = stdout.toString();
        let replyFromIndex = output.indexOf("from");

        if (
          replyFromIndex > 0 &&
          output.substring(replyFromIndex).toUpperCase().indexOf("BYTES") > 0
        ) {
          status = "online";
        }
        resolve({
          date: new Date().toISOString(),
          location: location,
          status: status,
        });
      });
    })
  );

  return promises;
};

setInterval(async function () {
  const promises = await pingFunction();
  console.log(
    "callback function every 5 second data ping  not connect database ===========> ",
    promises
  );
}, 5000);

exports.getPingPage = async function (req, res) {
  try {
    const promises = await pingFunction();
    await res.status(200).json({
      status: 200,
      data: promises,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, message: "Error getting subscriber page" });
  }
};
