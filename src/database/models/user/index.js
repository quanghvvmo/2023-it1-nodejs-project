const BaseModel = require("../base");
const UserRole = require("../userRole");
const Userform = require("../userform");
module.exports = class User extends BaseModel {
  static tableName = "user";
  static modelName = "user";
  static schema = require("./schema");
  static include = [
    {
      model: UserRole,
      as: "userRole",
    },
    {
      model: Userform,
      as: "userForm",
    },
  ];
  static associate(models) {
    this.hasMany(models.UserRole);
    this.hasOne(models.Userform);
  }
};
