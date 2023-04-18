import { DataTypes } from "sequelize";
import { FormStatus } from "../_utils/constants.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
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
            type: DataTypes.ENUM([FormStatus.OPEN, FormStatus.CLOSE]),
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createBy: {
            type: DataTypes.INTEGER,
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
