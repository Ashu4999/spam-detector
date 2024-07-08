const getContact = (req, res) => {
    try {
        return res.send("HERE CONTACT");
    } catch (Exception) {
        return res.status(500).send({ message: "Something went wrong" });
    }
};

module.exports = { getContact };