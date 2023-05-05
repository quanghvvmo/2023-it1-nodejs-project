const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class Form extends BaseModel {
    static tableName = "Form";
    static modelName = "Form";
    static schema = require("./schema")
    static associate(models) {
        this.belongsTo(models.FormCategory, {
            foreignKey: "typeId",
            targetKey: "id",
            as: "category",
        }),
            this.hasMany(models.UserForm, {
                foreignKey: "formId",
                as: "userform",
                onDelete: Options.CASCADE,
                onUpdate: Options.CASCADE
            })
    }

}