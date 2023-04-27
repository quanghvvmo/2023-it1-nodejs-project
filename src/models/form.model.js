import { DataTypes } from "sequelize";
import { FORM_STATUS } from "../constants/index.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM([FORM_STATUS.OPEN, FORM_STATUS.CLOSE]),
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        updateBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const timeConfig = {
        timestamps: true,
    };

    return sequelize.define("Form", columns, timeConfig);
};
