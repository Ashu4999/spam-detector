const getSpam = (req, res) => {
    try {
        return res.send("HERE SPAM");
    } catch (Exception) {
        return res.status(500).send({ message: "Something went wrong" });
    }
};

module.exports = { getSpam };