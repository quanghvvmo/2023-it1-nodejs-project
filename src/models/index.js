import Sequelize from "sequelize";
import applyExtraSetup from "./associates.js";

import config from "../config/index.js";
import userModel from "./user.model.js";
import roleModel from "./role.model.js";
import roleModulesModel from "./roleModules.model.js";
import formModel from "./form.model.js";
import formCategoryModel from "./formCategory.model.js";
import userFormModel from "./userForm.model.js";
import userFormDetailModel from "./userFormDetail.model.js";

const sequelize = new Sequelize(
    config.env === "test" ? "test" : config.dbDatabase,
    config.dbUsername,
    config.dbPassword,
    {
        host: config.dbHost,
        port: config.dbPort,
        dialect: config.dbDialect,
        logging: false,
    }
);

// models
const models = [
    userModel,
    formModel,
    roleModel,
    roleModulesModel,
    formCategoryModel,
    userFormModel,
    userFormDetailModel,
];

for (const model of models) {
    model(sequelize);
}

// associates
applyExtraSetup(sequelize);

// sync
sequelize.sync().then(() => {
    console.log("Sync successfully.");
});

export default sequelize;
