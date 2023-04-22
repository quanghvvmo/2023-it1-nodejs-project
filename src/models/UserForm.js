const { DataTypes } = require("sequelize");
const userFormTypes = require("../constants/types/userForm");

module.exports = (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        managerComment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userComment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(Object.values(userFormTypes)),
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }

    const timestampConfig = {
        timestamps: true,
        tableName: 'userForms'
    }

    return sequelize.define('UserForm', columns, timestampConfig);
}