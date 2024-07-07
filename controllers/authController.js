const resgister = (req, res) => {
  try {
    return res.send("HERE Register");
  } catch (Exception) {
    return res.status(500).json({ message: error.message });
  }
};

const login = (req, res) => {
  try {
    return res.send("HERE Register");
  } catch (Exception) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { resgister, login };
