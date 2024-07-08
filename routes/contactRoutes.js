const express = require("express");
const router = express.Router();
const { getContact, createContact, updateContact, deleteContact } = require("../controllers/contactController");
const Joi = require("joi");
const { requestParamsValidate } = require("../middleware/requestParamsValidate");

const getContactSchema = {
    query: Joi.object({
        uuids: Joi.string(),
        names: Joi.string(),
        userIDs: Joi.string(),
    }),
};

const createContactSchema = {
    body: Joi.object({
        contact_name: Joi.string().required(),
        contact_phone_number: Joi.string().required(),
        user_id: Joi.string(),
    }),
};

const updateContactSchema = {
    query: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required()
    }),
    body: Joi.object({
        contact_name: Joi.string().required(),
        contact_phone_number: Joi.string().required(),
        user_id: Joi.string(),
    }),
};

const deleteContactSchema = {
    query: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }).required()
    }),
};


router.get("/", requestParamsValidate(getContactSchema), getContact);
router.post("/", requestParamsValidate(createContactSchema), createContact);
router.put("/", requestParamsValidate(updateContactSchema), updateContact);
router.delete("/", requestParamsValidate(deleteContactSchema), deleteContact);

module.exports = router;