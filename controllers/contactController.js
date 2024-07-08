const { DBModels } = require("../config/dbConn");
const { Op } = require('sequelize');

const getContact = async (req, res) => {
    try {
        let where = {};
        const { uuids, names, userIDs } = req.query;

        if (uuids) {
            where["id"] = { [Op.in]: uuids.split(",") };
        }

        if (names) {
            where["contact_name"] = { [Op.in]: names.split(",") };
        }

        if (userIDs) {
            where["user_id"] = { [Op.in]: userIDs.split(",") };
        }

        let contacts = await DBModels.contact.findAll({ where });
        return res.send(contacts);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const createContact = async (req, res) => {
    try {
        const { contact_name, contact_phone_number, user_id } = req.body;

        const newContact = await DBModels.contact.create({
            contact_name,
            contact_phone_number,
            user_id,
        });

        return res.status(201).send(newContact);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.query;
        const { contact_name, contact_phone_number, user_id } = req.body;

        const contact = await DBModels.contact.findByPk(id);

        if (!contact) {
            throw { code: 404, message: "Contact not found" };
        }

        await contact.update({
            contact_name,
            contact_phone_number,
            user_id,
        });

        return res.send(contact);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.query;

        const contact = await DBModels.contact.findByPk(id);

        if (!contact) {
            throw { code: 404, message: "Contact not found" };
        }

        await contact.destroy();

        return res.send({ message: "Contact deleted successfully" });
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

module.exports = { getContact, createContact, updateContact, deleteContact };