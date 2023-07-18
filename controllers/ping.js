const exec = require("child_process").exec;
const url = require("url");

const location = "192.168.1.27";

const pingFunction = async function (url) {
  const promises = [];
  try {
    promises.push(
      await new Promise((resolve) => {
        exec(`ping -c 3 -W 1000 ${url || location}`, (err, stdout) => {
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
            location: url || location,
            status: status,
          });
        });
      })
    );

    return promises;
  } catch {
    return [];
  }
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
    var url_parts = url.parse(req?.url, true);
    var query = url_parts?.query;

    if (!query.url) {
      await res
        .status(400)
        .json({ status: 400, message: "Error request parameters url" });
    } else {
      const promises = await pingFunction(query?.url);
      await res.status(200).json({
        status: 200,
        data: promises,
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, message: "Error getting subscriber page" });
  }
};
