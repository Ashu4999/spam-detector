const express = require("express");
const router = express.Router();
const { getContact } = require("../controllers/contactController");

router.get("/", getContact);

module.exports = router;