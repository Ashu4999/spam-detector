const express = require("express");
const router = express.Router();
const {
  requestParamsValidate,
} = require("../middleware/requestParamsValidate");
const Joi = require("joi");
const { searchContact } = require("../controllers/searchController");

const searchSchema = {
  query: Joi.object({
    searchBy: Joi.string().valid('name', 'phone').required(),
    searchString: Joi.string().required(),
  }),
};

router.get("/", requestParamsValidate(searchSchema), searchContact);

module.exports = router;
