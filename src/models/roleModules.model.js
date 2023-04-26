import { DataTypes } from "sequelize";

export default (sequelize) => {
    const columns = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        api: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCanRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isCanWrite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isCanUpdate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        isCanDelete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    };

    return sequelize.define("RoleModules", columns);
};
