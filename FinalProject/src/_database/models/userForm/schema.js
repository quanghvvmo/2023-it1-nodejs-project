const Sequelize = require("sequelize");
import { FormStatus } from "../../../common/constant";
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    formid: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    managerid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    managerCmt: {
        type: Sequelize.TEXT,
    },
    userCmt: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: FormStatus.NEW
    },
    description: {
        type: Sequelize.STRING,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}