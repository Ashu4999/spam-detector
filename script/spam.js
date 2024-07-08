const { DBModels } = require("../config/dbConn");
const axios = require("axios");
const data = require("./spamData");
const { getRandomNumberFromRange } = require("../utils/helper");

async function pushData() {
    try {
        let index = 0;
        const userData = await DBModels.user.findAll({ raw: true });
        const contactData = await DBModels.contact.findAll({ raw: true });

        for (let item of data) {
            let payload = {};
            let userIndex = getRandomNumberFromRange(0, userData.length - 1);

            if (item.phone_ownername) {
                payload["phone_ownername"] = item.phone_ownername;
            }

            if (item.phone_number) {
                payload["phone_number"] = (item.phone_number).toString();
            }

            if (userIndex) {
                payload["marked_by"] = userData[userIndex].id;
            }

            console.log(payload, index);
            index++;
            await axios.post("http://localhost:7000/spam", payload);
        }

        for (let i = 0; i < 500; i++) {
            let payload = {};
            let userIndex = getRandomNumberFromRange(0, userData.length - 1);
            let randomContactNumber = getRandomNumberFromRange(0, contactData.length - 1);
            let currentContact = contactData[randomContactNumber];
            if (currentContact.contact_name) {
                payload["phone_ownername"] = currentContact.contact_name;
            }

            if (currentContact.contact_phone_number) {
                payload["phone_number"] = (currentContact.contact_phone_number).toString();
            }

            if (userIndex) {
                payload["marked_by"] = userData[userIndex].id;
            }

            console.log(payload, index);
            index++;
            await axios.post("http://localhost:7000/spam", payload);
        }
        console.log("Spam contact marked");
    } catch (error) {
        console.log(error.toString());
    }
}

pushData();