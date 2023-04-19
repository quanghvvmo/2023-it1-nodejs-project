import { Sequelize, DataTypes } from "sequelize";
module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  task: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  rate: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  result: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
};
