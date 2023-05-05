const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class User extends BaseModel {
    static tableName = "User";
    static modelName = "User";
    static schema = require("./schema");
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "userId",
            as: "userRole",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "userId",
            as: "user",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "managerId",
            as: "manager",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
    }
};
