const BaseModel = require('../base');

module.exports = class Form extends BaseModel {
    static tableName = 'Form';
    static modelName = 'Form';
    static schema = require('./schema')
    static associate(models) {
        this.belongsTo(models.FormCategory, {
            foreignKey: 'typeid',
            targetKey: "id",
            as: 'category',
        }),
            this.hasMany(models.UserForm, {
                foreignKey: 'formid',
                as: 'userform',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
    }

}