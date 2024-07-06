const express = require("express");
const app = express();
const PORT = process.env.PORT || 4500;
const db = require("./config/dbConn");

app.get("/", async (req, res) => {
  let Employees = await db.models.Department.findAll({ raw: true });
  console.log("Employees", Employees);
  return res.send("Hello World Change");
});

const initApp = async () => {
  try {
    db.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

initApp();
