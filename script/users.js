const { DBModels } = require("../config/dbConn");
const axios = require("axios");
const data = require("./userData");

async function pushData() {
    try {
        for (let item of data) {
            let payload = {
                username: item.name,
                password: item.password,
                phone: item.phone.toString(),
                email: item.email,
            };
            console.log(payload);
            await axios.post("http://localhost:7000/auth/register", payload);
        }
        console.log("User pushed successfully");
    } catch (error) {
        console.log(error.toString());
    }
}

pushData();