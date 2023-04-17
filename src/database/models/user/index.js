const BaseModel = require("../base");
const UserRole = require("../userRole");
module.exports = class User extends BaseModel {
  static tableName = "user";
  static modelName = "user";
  static schema = require("./schema");
  static include = [
    {
      model: UserRole,
      as: "userRole",
    },
  ];
  static associate(models) {
    this.hasMany(models.UserRole);
  }
};
