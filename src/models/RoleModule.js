const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        api: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        canRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        canWrite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        canUpdate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        canDelete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        canApprove: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'roleModules'
    };

    return sequelize.define("RoleModule", columns, timestampConfig);
};