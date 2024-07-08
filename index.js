const express = require("express");
const app = express();
const PORT = process.env.PORT || 4500;
const { sequelize } = require("./config/dbConn");
const { authRoutes, contactRoutes, spamRoutes, userRoutes } = require("./routes");
const cookieParser = require("cookie-parser");
const { authVerify } = require("./middleware/authVerify");

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

// app.use(authVerify);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);
app.use("/spam", spamRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

const initApp = async () => {
  try {
    sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

initApp();
