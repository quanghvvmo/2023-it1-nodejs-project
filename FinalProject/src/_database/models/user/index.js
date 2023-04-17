const BaseModel = require('../base');
const UserRole = require('../user_role')

module.exports = class User extends BaseModel {
    static tableName = 'user';
    static modelName = 'user';
    static schema = require('./schema')
    static include = [
        {
            model: UserRole,
            as: 'userRole'
        }
    ]
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignkey: 'userid',
            as: 'userRole',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

}