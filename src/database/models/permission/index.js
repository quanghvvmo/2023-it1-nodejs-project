const BaseModel = require("../base");
const Role = require("../role");
module.exports = class Permission extends BaseModel {
  static tableName = "Permission";
  static modelName = "Permission";
  static schema = require("./schema");
  static include = [
    {
      model: Role,
      as: "role",
    },
  ];
  static associate(models) {
    this.belongsTo(models.Role);
  }
};
