import { Sequelize, DataTypes } from "sequelize";
module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING(500),
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING(10),
    allowNull: false,
    defaultValue: "online",
  },
};
