const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ["id"] }],
      underscored: true,
    }
  );

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Contact;
};
