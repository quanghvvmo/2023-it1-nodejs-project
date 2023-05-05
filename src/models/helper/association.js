exports.setUpAssociations = (sequelize) => {
    const { 
        User, 
        Role, 
        RoleModule, 
        FormCategory, 
        Form, 
        UserForm, 
        UserFormDetail 
    } = sequelize.models;

    Role.hasMany(RoleModule, { foreignKey: 'roleId' });
    RoleModule.belongsTo(Role, { foreignKey: 'roleId' });

    Role.belongsToMany(User, { through: "UserRole", foreignKey: "roleId" });
    User.belongsToMany(Role, { through: "UserRole", foreignKey: "userId" });

    FormCategory.hasMany(Form, { foreignKey: 'formCategoryId' });
    Form.belongsTo(FormCategory, { foreignKey: 'formCategoryId' });

    Form.hasMany(UserForm, { foreignKey: 'formId' });
    UserForm.belongsTo(Form, { foreignKey: 'formId' });

    UserForm.hasMany(UserFormDetail, { foreignKey: 'userFormId' });
    UserFormDetail.belongsTo(UserForm, { foreignKey: 'userFormId' });

    User.hasMany(UserForm, { foreignKey: 'userId' });
    UserForm.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(UserForm, { foreignKey: "managerId" });
    UserForm.belongsTo(User, { foreignKey: "managerId" });

    User.hasOne(User, { foreignKey: "managerId" });
    User.belongsTo(User, { foreignKey: "managerId" });
}