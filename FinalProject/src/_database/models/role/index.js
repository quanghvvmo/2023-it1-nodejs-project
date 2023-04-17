const BaseModel = require('../base');
const UserRole = require('../user_role')

module.exports = class Role extends BaseModel {
    static tableName = 'role';
    static modelName = 'role';
    static schema = require('./schema')
    static include = [
        {
            model: UserRole,
            as: 'roleData'
        }
    ]
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignkey: 'roleid',
            as: 'roleData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

}