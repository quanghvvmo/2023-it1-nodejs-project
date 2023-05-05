const Sequelize = require("sequelize");
import { FormStatus } from "../../../common/constant";
module.exports = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    typeId: {
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