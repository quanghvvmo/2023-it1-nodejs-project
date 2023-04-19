import { Sequelize, DataTypes } from "sequelize";
module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  managerComment: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  userComment: {
    type: Sequelize.STRING(500),
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING(10),
  },
};
