const { DBModels } = require("../config/dbConn");
const { Op } = require('sequelize');

const getSpam = async (req, res) => {
    try {
        const { uuids, phoneNumbers } = req.query;
        let where = {};

        if (uuids) {
            where["id"] = { [Op.in]: uuids.split(",") };
        }

        if (phoneNumbers) {
            where["phone_number"] = { [Op.in]: phoneNumbers.split(",") };
        }

        const spams = await DBModels.spam.findAll({ where });
        return res.send(spams);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const createSpam = async (req, res) => {
    try {
        const { phone_ownername, phone_number, marked_by } = req.body;

        if (marked_by) {
            let foundMarkByUser = await DBModels.user.findByPk(marked_by);
            if (!foundMarkByUser) {
                throw { code: 409, message: "User not found who is marking the phone number as spam"};
            }
        }

        const newSpam = await DBModels.spam.create({
            phone_ownername,
            phone_number,
            marked_by
        });

        return res.status(201).send(newSpam);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const updateSpam = async (req, res) => {
    try {
        const { id } = req.query;
        const { phone_ownername, phone_number, marked_by } = req.body;

        const spam = await DBModels.spam.findByPk(id);

        if (!spam) {
            throw { code: 404,  message: "Spam entry not found" };
        }

        await spam.update({
            phone_ownername,
            phone_number,
            marked_by
        });

        return res.send(spam);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const deleteSpam = async (req, res) => {
    try {
        const { id } = req.query;

        const spam = await DBModels.spam.findByPk(id);

        if (!spam) {
            throw { code: 404, message: "Spam entry not found" };
        }

        await spam.destroy();

        return res.send({ message: "Spam entry deleted successfully" });
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

module.exports = { getSpam, createSpam, updateSpam, deleteSpam };
