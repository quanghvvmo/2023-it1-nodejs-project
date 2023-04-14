import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        managerComment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userComment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(["new", "submitted", "approved", "closed"]),
            allowNull: false,
        },
    };

    return sequelize.define("UserForm", columns);
};
