const BaseModel = require('../base');

module.exports = class formCategory extends BaseModel {
    static tableName = 'formCategory';
    static modelName = 'formCategory';
    static schema = require('./schema')
    static associate(models) {
        this.hasMany(models.Form, {
            foreignKey: 'typeid',
            as: 'form',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

}