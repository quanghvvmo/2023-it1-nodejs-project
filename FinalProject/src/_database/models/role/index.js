const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class Role extends BaseModel {
    static tableName = "Role";
    static modelName = "Role";
    static schema = require("./schema")
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "roleId",
            as: "roleData",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE
        }),
            this.hasMany(models.RoleModule, {
                foreignKey: "roleId",
                as: "roleModule",
                onDelete: Options.CASCADE,
                onUpdate: Options.CASCADE
            })
    }

}