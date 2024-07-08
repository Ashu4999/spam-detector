const express = require("express");
const router = express.Router();
const { getSpam } = require("../controllers/spamController");

router.get("/", getSpam);

module.exports = router;