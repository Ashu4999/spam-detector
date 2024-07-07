const { DBModels } = require("../config/dbConn");

const resgister = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    const User = await DBModels.user.create({ name: username, password, email, phone_number: phone });
    return res.send(User);
  } catch (Exception) {
    return res.status(500).json({ message: Exception.message });
  }
};

const login = (req, res) => {
  try {
    return res.send("HERE Register");
  } catch (Exception) {
    return res.status(500).json({ message: Exception.message });
  }
};

module.exports = { resgister, login };
