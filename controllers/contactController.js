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
        return res.json(contacts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
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

        return res.status(201).json(newContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.query;
        const { contact_name, contact_phone_number, user_id } = req.body;

        const contact = await DBModels.contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await contact.update({
            contact_name,
            contact_phone_number,
            user_id,
        });

        return res.json(contact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.query;

        const contact = await DBModels.contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await contact.destroy();

        return res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { getContact, createContact, updateContact, deleteContact };