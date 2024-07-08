const { DBModels } = require("../config/dbConn");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    let where = {}, foundUser = null;

    if (email || phone) {
      where = {
        [Op.or]: []
      };

      if (email) {
        where[Op.or].push({ email });
      }

      if (phone) {
        where[Op.or].push({ phone_number: phone });
      }
    }

    foundUser = await DBModels.user.findOne({ where, raw: true });

    console.log(foundUser, where, Object.keys(where).length);
    if (foundUser) {
      throw { code: 409, message: "User Already Exists" };
    }
    const hashPwd = await bcrypt.hash(password, 10);
    const User = await DBModels.user.create({ name: username, password: hashPwd, email, phone_number: phone });
    return res.send({ message: `User registered ${User.name} ${User.id}` });
  } catch (Exception) {
    let customeError = null;
    if (Exception.name === "SequelizeUniqueConstraintError") {
      customeError = Exception.errors[0].message;
    }
    return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    let where = {
      phone_number: phone
    };
    let foundUser = await DBModels.user.findOne({ where });
    if (!foundUser) {
      throw { code: 409, message: "No user found" }
    }

    const isPassEqual = await bcrypt.compare(password, foundUser.password);
    if (!isPassEqual) {
      throw { code: 401, message: "Invalid Crendentials" }
    }

    const accessToken = jwt.sign(
      { username: foundUser.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.name },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    foundUser.set('refreshToken', refreshToken);
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // domain: process.env.REACT_PROJECT_DOMAIN, sameSite: 'None', secure: true, //for https and different domains
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.send({ message: "Logged IN!!!", accessToken });
  } catch (Exception) {
    let customeError = null;
    if (Exception.name === "SequelizeUniqueConstraintError") {
      customeError = Exception.errors[0].message;
    }
    return res.status(Exception.code || 500).json({ message: customeError || Exception.message || Exception.toString() });
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt)
      return res.sendStatus(403);

    let refreshToken = cookies?.jwt;

    let foundUser = await DBModels.user.findOne({ where: { refreshToken } });

    if (!foundUser)
      return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        //throwing err if token username and DB token username not matched
        if (err || decoded.username != foundUser.name)
          return res.sendStatus(403);

        const accessToken = jwt.sign(
          {
            username: decoded.username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15s" }
        );

        return res.status(201).json({ message: "Access token created", accessToken })
      });
  } catch (Exception) {
    console.log(Exception);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { register, login, refreshToken };
