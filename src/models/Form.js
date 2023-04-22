const { DataTypes } = require('sequelize');
const formTypes = require("../constants/types/form");

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false,
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
            type: DataTypes.ENUM(Object.values(formTypes)),
            allowNull: false,
        },
        dueTo: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updateBy: {
            type: DataTypes.STRING,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'forms'
    }

    return sequelize.define("Form", columns, timestampConfig);
};