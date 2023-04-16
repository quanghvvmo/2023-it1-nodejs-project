const { Sequelize } = require("sequelize");
const config = require("../config/index.js");
const { setUpAssociations } = require('./association.js');
const { setUpHooks } = require('./hooks.js');

const User = require('./User.js');

const sequelize = new Sequelize(config.db_database, config.db_username, config.db_password, {
    host: config.db_host,
    port: config.db_port,
    dialect: config.db_dialect,
});

const models = [User];

models.forEach(model => {
    model(sequelize);
});

setUpAssociations(sequelize);
setUpHooks(sequelize);

module.exports = sequelize;




