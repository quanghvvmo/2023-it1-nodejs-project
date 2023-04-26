const sequelize = require('../models/helper/dbconfig');
const { UserForm } = sequelize.models;
const { ROLE_TYPES } = require('../config/constants');
const APIError = require('../helper/apiError');
const httpStatus = require('http-status');
const { USER_FORM_MESSAGE } = require('../constants/messages');

class UserFormService {
    getUserFormDetail = async (currentUser, id) => {
        const checkHRorAdmin =  currentUser.Roles.some((role) => role.name === ROLE_TYPES.ADMIN || role.name === ROLE_TYPES.HR);

        const userForm = await UserForm.findOne({
            include: [UserFormDetail],
            where: {
                id,
                isDeleted: false,
                [Op.or]: [
                    { UserId: currentUser.id },
                    { ManagerId: currentUser.id },
                    checkHRorAdmin && { isDeleted: false },
                ],
            },
        });

        if (!userForm) {
            throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return userForm;
    }
}

module.exports = new UserFormService();