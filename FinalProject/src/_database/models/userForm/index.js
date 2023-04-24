const BaseModel = require("../base");
import { Options } from "../../../common/constant"

module.exports = class userForm extends BaseModel {
    static tableName = "userForm";
    static modelName = "userForm";
    static schema = require("./schema");
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "userid",
            targetKey: "id",
            as: "user",
        });
        this.belongsTo(models.User, {
            foreignKey: "managerid",
            targetKey: "id",
            as: "manager",
        });
        this.belongsTo(models.Form, {
            foreignKey: "formid",
            targetKey: "id",
            as: "userform",
        });
        this.hasMany(models.FormDetail, {
            foreignKey: "formid",
            as: "formdetail",
            onDelete: Options.CASCADE,
            onUpdate: Options.CASCADE,
        })
    }
};
