const BaseModel = require("../base");
const Form = require("../form");
module.exports = class formCate extends BaseModel {
  static tableName = "formCategory";
  static modelName = "formCategory";
  static schema = require("./schema");
  static include = [
    {
      model: Form,
      as: "form",
    },
  ];
  static associate(models) {
    this.hasMany(models.Form);
  }
};
