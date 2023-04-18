import { DataTypes } from "sequelize";
import { FormCategories } from "../_utils/constants.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            type: DataTypes.ENUM([...Object.keys(FormCategories)]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define("FormCategory", columns);
};
