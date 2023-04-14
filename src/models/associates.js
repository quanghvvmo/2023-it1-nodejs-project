function applyExtraSetup(sequelize) {
    const { User, Role, RoleModules, FormCategory, Form, UserForm, UserFormDetail } =
        sequelize.models;

    Role.belongsToMany(User, { through: "UserRole" });
    User.belongsToMany(Role, { through: "UserRole" });

    Role.hasMany(RoleModules);
    RoleModules.belongsTo(Role);

    FormCategory.hasMany(Form);
    Form.belongsTo(FormCategory);

    Form.hasMany(UserForm);
    UserForm.belongsTo(Form);

    UserForm.hasOne(UserFormDetail);
    UserFormDetail.belongsTo(UserForm);

    User.hasMany(UserForm);
    UserForm.belongsTo(User);
}

export default applyExtraSetup;
