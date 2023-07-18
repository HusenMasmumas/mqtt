const express = require("express");
const router = express.Router();

var subscriberController = require("../controllers/ping");

// Subscriber Home Route.
router.get("/", subscriberController.getPingPage);

module.exports = router;
