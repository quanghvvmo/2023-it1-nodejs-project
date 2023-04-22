const bcrypt = require('bcrypt');

exports.setUpHooks = (sequelize) => {
    const { User, Role, RoleModule, FormCategory, Form, UserForm, UserFormDetail } = sequelize.models;
    
    User.beforeCreate(async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    });

    User.beforeUpdate(async (user, options) => {
        if (user.changed('password')) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
    });

    User.prototype.checkPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
}