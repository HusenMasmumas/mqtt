const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//routes
const subscriberRouter = require("./routes/subscriber");
app.use(cors());
app.use(express.json());
app.use("/", subscriberRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
