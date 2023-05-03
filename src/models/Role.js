const { DataTypes } = require('sequelize');
const { ROLE_TYPES } = require("../config/constants");

module.exports = (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.ENUM(Object.values(ROLE_TYPES)),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'roles'
    }

    return sequelize.define("Role", columns, timestampConfig);
};