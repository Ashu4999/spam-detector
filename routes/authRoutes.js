const express = require("express");
const router = express.Router();
const { resgister, login } = require("../controllers/authController");
const { requestParamsValidate } = require("../middleware/requestParamsValidate");
const Joi = require('joi');

const userSchema = {
    body: Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
            }),
        phone: Joi.string().required(),
    }),
};

router.post("/register", requestParamsValidate(userSchema), resgister).get("/login", login);

module.exports = router;
