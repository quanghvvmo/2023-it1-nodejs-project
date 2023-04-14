import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        selfRating: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        achievements: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        others: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        result: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM(["open", "closed"]),
            allowNull: false,
        },
    };

    const timeConfig = {
        timestamps: true,
    };

    return sequelize.define("UserFormDetail", columns, timeConfig);
};
