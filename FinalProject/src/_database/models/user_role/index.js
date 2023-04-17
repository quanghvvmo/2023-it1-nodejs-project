const BaseModel = require('../base');
const User = require('../user');
const Role = require('../role');

module.exports = class UserRole extends BaseModel {
    static tableName = 'userrole';
    static modelName = 'userrole';
    static schema = require('./schema')
    static include = [
        {
            model: User,
            as: 'user',
            where: {
                isDeleted: 0
            }
        },
        {
            model: Role
        }
    ]
    static associate(models) {
        this.belongTo(models.User, {
            foreignKey: 'userid',
            targetKey: 'id',
            as: 'user'
        });
        this.belongTo(models.Role, {
            foreignKey: 'role',
            targetKey: 'id',
            as: 'role'
        })
    }

}