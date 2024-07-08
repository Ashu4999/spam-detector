const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer "))
        return res.sendStatus(401);

    //getting token from request header
    const accessToken = req.headers["authorization"].split(" ")[1];

    //verifying access token
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
                return res.sendStatus(403); //Forbidden

            req.username = decoded.username;
            next();
        });
}

module.exports = { authVerify };

