const { sequelize, QueryTypes, DBModels } = require("../config/dbConn");

const searchContact = async (req, res) => {
    try {
        const { searchBy, searchString } = req.query;
        let query = null, finalResult = null;
        if (searchBy === "name") {
            query = `
                SELECT 
                    COALESCE(contacts.contact_name, spams.phone_ownername, 'NA') AS name,
                    COALESCE(contacts.contact_phone_number, spams.phone_number, 'NA') AS phone_number,
                    CASE WHEN spams.id IS NOT NULL THEN 'true' ELSE 'false' END AS isSpam
                FROM 
                    contacts
                FULL OUTER JOIN 
                    spams ON contacts.contact_phone_number = spams.phone_number
                WHERE 
                    contacts.contact_name ILIKE '%${searchString}%'
                ORDER BY 
                    CASE 
                        WHEN contacts.contact_name ILIKE '${searchString}%' THEN 1 
                        ELSE 2 
                    END, 
                    contacts.contact_name;
            `;
            const [result, metadata] = await sequelize.query(query);
            finalResult = result;
        } else if (searchBy === "phone") {
            let foundUser = await DBModels.user.findOne({ where: { phone_number: searchString } });
            if (foundUser) {
                finalResult = {
                    name: foundUser.name,
                    phone_number: foundUser.phone_number,
                    email: foundUser.email
                };
            } else {
                query = `
                    SELECT 
                        spams.id AS spam_id, 
                        contacts.id AS contact_id,
                        COALESCE(contacts.contact_name, spams.phone_ownername, 'NA') AS contact_name,
                        COALESCE(contacts.contact_phone_number, spams.phone_number, 'NA') AS contact_phone_number,
                        CASE WHEN spams.id IS NOT NULL THEN 'true' ELSE 'false' END AS isSpam
                    FROM 
                        contacts
                    FULL OUTER JOIN 
                        spams ON contacts.contact_phone_number = spams.phone_number
                    WHERE 
                        contacts.contact_phone_number = '${searchString}' or spams.phone_number = '${searchString}';
                `;
                const [result, metadata] = await sequelize.query(query);
                finalResult = result;
            }
        }
        return res.send(finalResult);
    } catch (Exception) {
        console.error(Exception);
        let customeError = null;
        if (Exception.name === "SequelizeUniqueConstraintError") {
            customeError = Exception.errors[0].message;
        }
        return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
    }
};

module.exports = { searchContact };