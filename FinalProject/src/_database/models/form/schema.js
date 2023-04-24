const Sequelize = require("sequelize");
import { FormStatus } from "../../../common/constant";
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    typeid: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: FormStatus.OPEN
    },
    expDate: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}