const { DataTypes } = require('sequelize');
const formCategoryTypes = require("../constants/types/formCategory");

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.ENUM(Object.values(formCategoryTypes)),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
    }

    return sequelize.define("FormCategory", columns, timestampConfig);
};