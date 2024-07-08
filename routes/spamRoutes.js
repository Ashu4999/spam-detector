const express = require("express");
const router = express.Router();
const { getSpam, createSpam, updateSpam, deleteSpam } = require("../controllers/spamController");
const Joi = require("joi");
const { requestParamsValidate } = require("../middleware/requestParamsValidate");

const getSpamSchema = {
    query: Joi.object({
        uuids: Joi.string(),
        phoneNumbers: Joi.string(),
    }),
};

const createSpamSchema = {
    body: Joi.object({
        phone_ownername: Joi.string(),
        phone_number: Joi.string().required(),
        marked_by: Joi.string().guid({ version: ['uuidv4'] }),
    }),
};

const updateSpamSchema = {
    query: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    }),
    body: Joi.object({
        phone_ownername: Joi.string(),
        phone_number: Joi.string().required(),
        marked_by: Joi.string().guid({ version: ['uuidv4'] }),
    }),
};

const deleteSpamSchema = {
    query: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    }),
};

router.get("/", requestParamsValidate(getSpamSchema), getSpam);
router.post("/", requestParamsValidate(createSpamSchema), createSpam);
router.put("/", requestParamsValidate(updateSpamSchema), updateSpam);
router.delete("/", requestParamsValidate(deleteSpamSchema), deleteSpam);

router.get("/", getSpam);

module.exports = router;