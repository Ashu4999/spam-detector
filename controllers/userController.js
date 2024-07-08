const { DBModels } = require("../config/dbConn");
const { Op } = require('sequelize');

const getUser = async (req, res) => {
    try {
        const { uuids, names, phoneNumbers, emails } = req.query;
        let where = {};

        if (uuids) {
            where["id"] = { [Op.in]: uuids.split(",") };
        }

        if (names) {
            where["name"] = { [Op.in]: names.split(",") };
        }

        if (phoneNumbers) {
            where["phone_number"] = { [Op.in]: phoneNumbers.split(",") };
        }

        if (emails) {
            where["email"] = { [Op.in]: emails.split(",") };
        }

        const users = await DBModels.user.findAll({ where, attributes: { exclude: ['password'] } });
        return res.send(users);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.query;
        const { username, email } = req.body;

        const User = await DBModels.user.findOne({ where: { id }, attributes: { exclude: ['password'] } });

        if (!User) {
            throw { code: 404, message: "User not found" };
        }

        await User.update({
            name: username,
            email: email
        });

        return res.send({ message: `User updated successfully`, user: User });
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.query;

        const User = await DBModels.user.findByPk(id);

        if (!User) {
            throw { code: 404, message: "User not found" };
        }

        await DBModels.user.destroy({ where: { id } });

        return res.send({ message: "User deleted successfully" });
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};


module.exports = { getUser, updateUser, deleteUser };