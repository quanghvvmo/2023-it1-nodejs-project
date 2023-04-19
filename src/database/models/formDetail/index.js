const BaseModel = require("../base");
const Userform = require("../userform");
module.exports = class UserFormDetail extends BaseModel {
  static tableName = "formdetail";
  static modelName = "formdetail";
  static schema = require("./schema");
  static include = [
    {
      model: Userform,
      as: "userform",
    },
  ];
  static associate(models) {
    this.belongsTo(models.Userform);
  }
};
