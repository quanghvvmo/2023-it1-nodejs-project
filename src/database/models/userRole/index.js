const Role = require("../role");
const BaseModel = require("../base");
const User = require("../user");
module.exports = class userRole extends BaseModel {
  static tableName = "userRole";
  static modelName = "userRole";
  static schema = require("./schema");
  static include = [
    {
      model: Role,
      as: "role",
    },
    {
      model: User,
      as: "user",
    },
  ];
  static associate(models) {
    this.belongsTo(models.Role);
    this.belongsTo(models.User);
  }
};
