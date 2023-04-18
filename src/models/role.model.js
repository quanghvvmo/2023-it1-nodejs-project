import { DataTypes } from "sequelize";
import { Roles } from "../_utils/constants.js";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM([...Object.keys(Roles)]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define("Role", columns);
};
