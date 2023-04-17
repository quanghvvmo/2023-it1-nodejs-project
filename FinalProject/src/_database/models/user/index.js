const BaseModel = require("../base");
const userRole = require("../user_role");

module.exports = class User extends BaseModel {
  static tableName = "user";
  static modelName = "user";
  static schema = require("./schema");
  static include = [
    {
      model: userRole,
      as: "userRole",
    },
  ];
  static associate(models) {
    this.hasMany(models.userRole, {
      foreignkey: "userid",
      as: "userRole",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
};
