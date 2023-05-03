const { DataTypes } = require('sequelize');

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
            allowNull: false,
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'userFormDetails'
    }

    return sequelize.define("UserFormDetail", columns, timestampConfig);
};