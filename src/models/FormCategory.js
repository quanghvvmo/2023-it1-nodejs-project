const { DataTypes } = require('sequelize');
const { FORM_CATEGORY_TYPES } = require("../config/constants");

module.exports = (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.ENUM(Object.values(FORM_CATEGORY_TYPES)),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'formCategories'
    }

    return sequelize.define("FormCategory", columns, timestampConfig);
};