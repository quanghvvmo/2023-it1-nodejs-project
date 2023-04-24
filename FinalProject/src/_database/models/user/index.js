const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class User extends BaseModel {
    static tableName = "User";
    static modelName = "User";
    static schema = require("./schema");
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "userid",
            as: "userRole",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "userid",
            as: "user",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "managerid",
            as: "manager",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        });
    }
};
