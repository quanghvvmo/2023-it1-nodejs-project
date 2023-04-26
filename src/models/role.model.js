import { DataTypes } from "sequelize";
import { ROLES } from "../constants/index.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM([...Object.keys(ROLES)]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define("Role", columns);
};
