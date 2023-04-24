const BaseModel = require("../base");


module.exports = class userRole extends BaseModel {
    static tableName = "userRole";
    static modelName = "userRole";
    static schema = require("./schema");
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "userid",
            targetKey: "id",
            as: "userRole",
        });
        this.belongsTo(models.Role, {
            foreignKey: "roleid",
            targetKey: "id",
            as: "roleData",
        });
    }
};
