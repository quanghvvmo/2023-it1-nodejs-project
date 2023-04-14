import { DataTypes } from "sequelize";

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
            type: DataTypes.ENUM(["open", "closed"]),
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
    };

    const timeConfig = {
        timestamps: true,
    };

    return sequelize.define("Form", columns, timeConfig);
};
