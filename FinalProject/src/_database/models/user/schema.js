const Sequelize = require("sequelize");
module.exports = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    empCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING
    },
    bhxh: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
    }

}