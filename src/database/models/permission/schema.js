import { Sequelize, DataTypes } from "sequelize";
module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  write: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  udate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  approve: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};
