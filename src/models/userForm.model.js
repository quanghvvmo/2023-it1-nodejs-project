import { DataTypes } from "sequelize";
import { USER_FORM_STATUS } from "../constants/index.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        managerComment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userComment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM([
                USER_FORM_STATUS.NEW,
                USER_FORM_STATUS.SUBMITTED,
                USER_FORM_STATUS.APPROVED,
                USER_FORM_STATUS.CLOSED,
            ]),
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    return sequelize.define("UserForm", columns);
};
