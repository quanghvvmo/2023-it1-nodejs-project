const sequelize = require('../models/helper/dbconfig');
const { UserForm, UserFormDetail } = sequelize.models;
const { ROLE_TYPES } = require('../config/constants');
const APIError = require('../helper/apiError');
const httpStatus = require('http-status');
const { USER_FORM_MESSAGE } = require('../constants/messages');
const { APIResponse, APIPagingResponse } = require('../helper/apiResponse');

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

    getListUserForms = async (currentUser, pageIndex, pageSize) => {
        const checkHRorAdmin =  currentUser.Roles.some((role) => role.name === ROLE_TYPES.ADMIN || role.name === ROLE_TYPES.HR);
        
        const userForms = await UserForm.findAll({
            include: [UserFormDetail],
            where: {
                isDeleted: false,
                [Op.or]: [
                    { UserId: currentUser.id },
                    { ManagerId: currentUser.id },
                    checkHRorAdmin && { isDeleted: false },
                ],
            },
        });

        const numOfUserForms = userForms.length;
        if (!numOfUserForms) {
            throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfUserForms / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: USER_FORM_MESSAGE.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
        }
    
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
    
        return new APIPagingResponse(
            userForms.slice(start, end),
            pageIndex,
            pageSize,
            numOfUserForms,
            totalPages,
        );
    }

    updateUserForm = async (id, data) => {
        const userForm = await UserForm.update(data, {
            where: {
                id,
                isDeleted: false
            }
        });
        if(!userForm) {
            throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return new APIResponse(userForm, httpStatus.OK, USER_FORM_MESSAGE.USER_FORM_UPDATED);
    }

    deleteUserForm = async (id) => {
        let userForm;
        const transaction = await sequelize.transaction();
    
        try {
            userForm = await UserForm.update({ isDeleted: true }, { where: { id } });
            const UserFormId = userForm.id;
            await UserFormDetail.update({ isDeleted: true }, { where: { UserFormId } });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    
        return new APIResponse(userForm, httpStatus.OK, USER_FORM_MESSAGE.USER_FORM_DELETED);
    }
}

module.exports = new UserFormService();