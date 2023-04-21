const BaseModel = require("../base");

module.exports = class User extends BaseModel {
    static tableName = "User";
    static modelName = "User";
    static schema = require("./schema");
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "userid",
            as: "userRole",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        this.hasMany(models.UserForm, {
            foreignKey: "userid",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        this.hasMany(models.UserForm, {
            foreignKey: "managerid",
            as: "manager",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
};
