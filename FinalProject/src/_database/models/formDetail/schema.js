const Sequelize = require('sequelize');
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    formid: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    result: {
        type: Sequelize.STRING,
    },
    point: {
        type: Sequelize.INTEGER,
    },
    descTask: {
        type: Sequelize.TEXT,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}