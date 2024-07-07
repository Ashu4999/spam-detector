const express = require("express");
const router = express.Router();
const { resgister, login } = require("../controllers/authController");

router.get("/register", resgister).get("/login", login);

module.exports = router;
