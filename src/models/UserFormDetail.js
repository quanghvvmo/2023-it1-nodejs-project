const { DataTypes } = require('sequelize');

export default (sequelize) => {
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
    }

    return sequelize.define("UserFormDetail", columns, timestampConfig);
};