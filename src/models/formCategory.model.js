import { DataTypes } from "sequelize";
import { FORM_CATEGORIES } from "../constants/index.js";

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
            type: DataTypes.ENUM([...Object.keys(FORM_CATEGORIES)]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define("FormCategory", columns);
};
