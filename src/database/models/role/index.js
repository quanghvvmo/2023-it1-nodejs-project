const UserRole = require("../userRole");
const Permission = require("../permission");
const BaseModel = require("../base");
module.exports = class Role extends BaseModel {
  static tableName = "Role";
  static modelName = "Role";
  static schema = require("./schema");
  static include = [
    {
      model: UserRole,
      as: "userrole",
    },
    {
      model: Permission,
      as: "permission",
    },
  ];
  static associate(models) {
    this.hasMany(models.UserRole);
    this.hasMany(models.Permission);
  }
};
