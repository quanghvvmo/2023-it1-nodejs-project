import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.ENUM(["admin", "director", "hr", "manager", "employee"]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    return sequelize.define("Role", columns);
};
