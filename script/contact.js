const { DBModels } = require("../config/dbConn");
const axios = require("axios");
const data = require("./contactData");
const { getRandomNumberFromRange } = require("../utils/helper");

async function pushData() {
    try {
        let i = 0;
        const userData = await DBModels.user.findAll({ raw: true });
        console.log(data.length);
        for (let item of data) {
            let payload = {};
            let userIndex = getRandomNumberFromRange(0, userData.length - 1);

            if (item.contact_name) {
                payload["contact_name"] = item.contact_name;
            }

            if (item.contact_phone_number) {
                payload["contact_phone_number"] = (item.contact_phone_number).toString();
            }

            if (i % 2 === 0 && item.contact_name) {
                payload["user_id"] = userData[userIndex].id;
            }

            console.log(payload, i);
            i++;
            await axios.post("http://localhost:7000/contact", payload);
        }
        console.log("Contact pushed successfully");
    } catch (error) {
        console.log(error.toString());
    }
}

pushData();