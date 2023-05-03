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

    Role.hasMany(RoleModule);
    RoleModule.belongsTo(Role);

    Role.belongsToMany(User, { through: "UserRole" });
    User.belongsToMany(Role, { through: "UserRole" });

    FormCategory.hasMany(Form);
    Form.belongsTo(FormCategory);

    Form.hasMany(UserForm);
    UserForm.belongsTo(Form);

    UserForm.hasMany(UserFormDetail);
    UserFormDetail.belongsTo(UserForm);

    User.hasMany(UserForm);
    UserForm.belongsTo(User);

    User.hasMany(UserForm, { foreignKey: "ManagerId" });
    UserForm.belongsTo(User, { foreignKey: "ManagerId" });

    User.hasOne(User, { foreignKey: "ManagerId" });
    User.belongsTo(User, { foreignKey: "ManagerId" });
}