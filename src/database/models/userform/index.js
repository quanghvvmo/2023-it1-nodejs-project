const BaseModel = require("../base");
const User = require("../user");
const Form = require("../form");
const FormDetail = require("../formDetail");
module.exports = class UserForm extends BaseModel {
  static tableName = "userform";
  static modelName = "userform";
  static schema = require("./schema");
  static include = [
    {
      model: User,
      as: "user",
    },
    {
      model: Form,
      as: "form",
    },
    {
      model: FormDetail,
      as: "formdetail",
    },
  ];
  static associate(models) {
    this.belongsTo(models.Form);
    this.belongsTo(models.User);
    this.hasMany(models.FormDetail);
  }
};
