const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class formCategory extends BaseModel {
    static tableName = "formCategory";
    static modelName = "formCategory";
    static schema = require("./schema")
    static associate(models) {
        this.hasMany(models.Form, {
            foreignKey: "typeid",
            as: "form",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE
        })
    }

}