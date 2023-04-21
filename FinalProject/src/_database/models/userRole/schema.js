const Sequelize = require('sequelize');
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    roleid: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
}