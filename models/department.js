const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Department = sequelize.define(
    "Department",
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
    },
    {
      indexes: [{ unique: true, fields: ["id"] }],
    }
  );

  Department.associate = (models) => {
    Department.hasMany(models.Employee, {
      foreignKey: "departmentId",
      as: "employees",
    });
  };

  return Department;
};
