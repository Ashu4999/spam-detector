const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
      }
    },
    {
      indexes: [{ unique: true, fields: ["id", "phone_number", "email"] }],
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Contact, {
      foreignKey: "user_id",
      as: "contacts",
    });
    User.hasMany(models.Spam, {
      foreignKey: "marked_by",
      as: "spam_marks",
    });
  };

  return User;
};
