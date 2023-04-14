function applyExtraSetup(sequelize) {
    const { User, Role, RoleModules, FormCategory, Form } = sequelize.models;

    Role.belongsToMany(User, { through: "UserRole" });
    User.belongsToMany(Role, { through: "UserRole" });

    Role.hasMany(RoleModules);
    RoleModules.belongsTo(Role);

    FormCategory.hasMany(Form);
    Form.belongsTo(FormCategory);
}

export default applyExtraSetup;
