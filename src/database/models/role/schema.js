import { Sequelize } from "sequelize";

module.exports = {
  id: {
    type: Sequelize.STRING(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV1,
  },
  name: {
    type: Sequelize.STRING(36),
    allowNull: false,
  },
};
