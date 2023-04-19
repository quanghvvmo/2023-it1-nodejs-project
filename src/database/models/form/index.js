const BaseModel = require("../base");
const FormCate = require("../formCate");
module.exports = class formCate extends BaseModel {
  static tableName = "form";
  static modelName = "form";
  static schema = require("./schema");
  static include = [
    {
      model: FormCate,
      as: "formCate",
    },
  ];
  static associate(models) {
    this.belongsTo(models.FormCate);
  }
};
