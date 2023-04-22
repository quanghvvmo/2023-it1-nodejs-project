exports.setUpAssociations = (sequelize) => {
    const { User, Role, RoleModule, FormCategory, Form, UserForm, UserFormDetail } = sequelize.models;

    User.belongsToMany(Role, { through: "UserRole" });
    Role.belongsToMany(User, { through: "UserRole" });

    User.hasMany(UserForm);
    UserForm.belongsTo(User);

    User.hasMany(UserForm, { foreignKey: "ManagerId" });
    UserForm.belongsTo(User, { foreignKey: "ManagerId" });

    User.hasOne(User, { foreignKey: "ManagerId" });
    User.belongsTo(User, { foreignKey: "ManagerId" });

    Role.hasMany(RoleModule);
    RoleModule.belongsTo(Role);

    FormCategory.hasMany(Form);
    Form.belongsTo(FormCategory);

    Form.hasMany(UserForm);
    UserForm.belongsTo(Form);

    UserForm.hasMany(UserFormDetail);
    UserFormDetail.belongsTo(UserForm);
}