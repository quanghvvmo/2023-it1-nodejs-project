const BaseModel = require('../base');

module.exports = class Role extends BaseModel {
    static tableName = 'Role';
    static modelName = 'Role';
    static schema = require('./schema')
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: 'roleid',
            as: 'roleData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }),
            this.hasMany(models.RoleModule, {
                foreignKey: 'roleid',
                as: 'roleModule',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
    }

}