// database.js
const { Sequelize } = require("sequelize");
const models = require("../models");
let associations = {}, DBModels = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

//defining model using connection variable
Object.keys(models).forEach((model) => {
  let currentModel = models[model](sequelize);
  DBModels[model] = currentModel;
  if (currentModel.associate) {
    associations[model] = currentModel.associate;
  }
});

// Set up associations
Object.keys(associations).forEach((modelName) => {
  if (associations[modelName]) {
    associations[modelName](sequelize.models);
  }
});

module.exports = { sequelize, DBModels };
