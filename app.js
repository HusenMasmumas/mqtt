const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//routes
const subscriberRouter = require("./routes/subscriber");
const pingRouter = require("./routes/ping");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/mqtt", subscriberRouter);
app.use("/ping", pingRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
