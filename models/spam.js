const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Spam = sequelize.define(
    "Spam",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ["id"] }],
      underscored: true,
    }
  );

  Spam.associate = (models) => {
    Spam.belongsTo(models.User, {
      foreignKey: "marked_by",
      as: "user",
    });
  };

  return Spam;
};
