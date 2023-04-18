import { DataTypes } from "sequelize";
import { UserFormStatus } from "../_utils/constants.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
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
                UserFormStatus.NEW,
                UserFormStatus.SUBMITTED,
                UserFormStatus.APPROVED,
                UserFormStatus.CLOSED,
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
