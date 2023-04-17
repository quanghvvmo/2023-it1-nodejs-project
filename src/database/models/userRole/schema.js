import { Sequelize } from "sequelize";

module.exports = {
  id: {
    type: Sequelize.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV1,
  },
};
