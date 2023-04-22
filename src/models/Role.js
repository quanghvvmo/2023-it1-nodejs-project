const { DataTypes } = require('sequelize');
const roleTypes = require("../constants/types/role");

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.ENUM(Object.values(roleTypes)),
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