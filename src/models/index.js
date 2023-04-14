import Sequelize from "sequelize";
import applyExtraSetup from "./associates.js";

import config from "../config/index.js";
import userModel from "./user.model.js";
import formModel from "./form.model.js";
import roleModel from "./role.model.js";
import roleModulesModel from "./roleModules.model.js";
import formCategoryModel from "./formCategory.js";
import userFormModel from "./userForm.js";

const sequelize = new Sequelize(config.db_database, config.db_username, config.db_password, {
    host: config.db_host,
    port: config.db_port,
    dialect: config.db_dialect,
});

// models
const models = [
    userModel,
    formModel,
    roleModel,
    roleModulesModel,
    formCategoryModel,
    userFormModel,
];

for (const model of models) {
    model(sequelize);
}

// associates
applyExtraSetup(sequelize);

// sync
sequelize.sync({ alter: true }).then(() => {
    console.log("Sync successfully.");
});

export default sequelize;
