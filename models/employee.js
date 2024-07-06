const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Employee = sequelize.define(
    "Employee",
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
      address: {
        type: DataTypes.STRING,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Departments",
          key: "id",
        },
      },
    },
    {
      indexes: [{ unique: true, fields: ["id"] }],
    }
  );

  Employee.associate = (models) => {
    Employee.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
    });
  };

  return Employee;
};
