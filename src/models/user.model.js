import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CMND: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        isActive: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    };

    const timeConfig = {
        timestamps: true,
    };

    return sequelize.define("User", columns, timeConfig);
};
