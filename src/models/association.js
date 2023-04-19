exports.setUpAssociations = (sequelize) => {
    const { User, Role, RoleModule } = sequelize.models;

    User.belongsToMany(Role, { through: "UserRole" });
    Role.belongsToMany(User, { through: "UserRole" });

    Role.hasMany(RoleModule);
    RoleModule.belongsTo(Role);
}