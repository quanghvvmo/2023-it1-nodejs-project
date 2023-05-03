const { DataTypes } = require("sequelize");
const { USER_FORM_TYPES } = require("../config/constants");

module.exports = (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        managerComment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userComment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(Object.values(USER_FORM_TYPES)),
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