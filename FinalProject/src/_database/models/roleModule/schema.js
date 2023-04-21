const Sequelize = require('sequelize');
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    roleid: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    api: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isCanRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isCanAdd: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isCanEdit: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isCanDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
}