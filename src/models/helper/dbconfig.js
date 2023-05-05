const { Sequelize } = require("sequelize");
const config = require("../../config/index");
const { setUpAssociations } = require('./association.js');
const { setUpHooks } = require('./hooks.js');

const User = require('../user');
const Role = require('../role.js');
const RoleModule = require('../roleModule.js');
const Form = require('../form.js');
const FormCategory = require('../formCategory.js');
const UserForm = require('../userForm')
const UserFormDetail = require('../userFormDetail');

const sequelize = new Sequelize(config.dbDatabase, config.dbUsername, config.dbPassword, {
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dbDialect || 'mysql',
});

const models = [User, Role, RoleModule, Form, FormCategory, UserForm, UserFormDetail];  

models.forEach(model => {
    model(sequelize);
});

setUpAssociations(sequelize);
setUpHooks(sequelize);

module.exports = sequelize;




