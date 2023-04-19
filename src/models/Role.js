import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.ENUM(["admin", "director", "manager", "hr", "employee"]),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const timestampConfig = {
        timestamps: true,
        tableName: 'users'
    }

    return sequelize.define("Role", columns, timestampConfig);
};