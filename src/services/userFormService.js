const sequelize = require('../models/helper/dbconfig');
const { UserForm, UserFormDetail, FormCategory, Form } = sequelize.models;
const { ROLE_TYPES, USER_FORM_TYPES } = require('../config/constants');
const APIError = require('../helper/apiError');
const httpStatus = require('http-status');
const { USER_FORM_MESSAGE } = require('../constants/messages');
const { APIResponse, APIPagingResponse } = require('../helper/apiResponse');
const { Op } = require('sequelize');
const { includes } = require('lodash');

class UserFormService {
    getUserFormDetail = async (currentUser, id) => {
        const checkHRorAdmin = currentUser.Roles.some((role) => role.name === ROLE_TYPES.ADMIN || role.name === ROLE_TYPES.HR);

        const userForm = await UserForm.findOne({
            include: [UserFormDetail],
            where: {
                id,
                isDeleted: false,
                [Op.or]: [
                    { userId: currentUser.id },
                    { managerId: currentUser.id },
                    checkHRorAdmin && { isDeleted: false },
                ],
            },
        });

        if (!userForm) {
            throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return userForm;
    }

    approveUserForm = async (data) => {
        const { userIds, managerComment } = data;

        let transaction;
        let updatedUserForms;
        try {
            transaction = await sequelize.transaction();

            const userForms = await UserForm.findAll({
                where: {
                    id: userIds,
                    isDeleted: false,
                    status: USER_FORM_TYPES.SUBMITTED,
                },
                lock: true,
                transaction,
            });

            if (!userForms.length) {
                throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
            }

            updatedUserForms = await UserForm.update(
                { status: USER_FORM_TYPES.APPROVED, managerComment },
                {
                    where: {
                        id: userIds,
                        isDeleted: false,
                        status: USER_FORM_TYPES.SUBMITTED,
                        
                    },
                    transaction,
                }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return new APIResponse(updatedUserForms, USER_FORM_MESSAGE.USER_FORM_UPDATED, httpStatus.OK);
    }

    closeUserForm = async (data) => {
        const { userIds } = data;

        let transaction; 
        let userForms;
        try {
            transaction = await sequelize.transaction();

            userForms = await UserForm.update(
                { status: USER_FORM_TYPES.CLOSED },
                {
                    where: { 
                        id: userIds, 
                        status: USER_FORM_TYPES.APPROVED, 
                        isDeleted: false 
                    },
                    transaction
                }
            );

            if (!userForms) {
                throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error
        } 

        return new APIResponse(userForms, USER_FORM_MESSAGE.USER_FORM_UPDATED, httpStatus.OK);
    }

    getListUserForms = async (currentUser, pageIndex, pageSize, status) => {
        const checkHRorAdmin = currentUser.Roles.some((role) => role.name === ROLE_TYPES.ADMIN || role.name === ROLE_TYPES.HR);

        let userForms;
        if(!status) {
            userForms = await UserForm.findAll({
                include: [UserFormDetail],
                where: {
                    isDeleted: false,
                    [Op.or]: [
                        { userId: currentUser.id },
                        { managerId: currentUser.id },
                        checkHRorAdmin && { isDeleted: false },
                    ],
                },
            });
        }
        else if(status === USER_FORM_TYPES.SUBMITTED) {
            userForms = await UserForm.findAll({
                include: [
                    UserFormDetail,
                ],
                where: {
                    isDeleted: false,
                    [Op.or]: [
                        { userId: currentUser.id },
                        { managerId: currentUser.id },
                        checkHRorAdmin && { isDeleted: false },
                    ],
                    status: USER_FORM_TYPES.SUBMITTED,
                },
            });
        }
        else {
            userForms = await UserForm.findAll({
                include: [
                    UserFormDetail
                ],
                where: {
                    isDeleted: false,
                    [Op.or]: [
                        { userId: currentUser.id },
                        { managerId: currentUser.id },
                        checkHRorAdmin && { isDeleted: false },
                    ],
                    status: USER_FORM_TYPES.NEW,
                },
            });
        }

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
        if (!userForm) {
            throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return new APIResponse(userForm, httpStatus.OK, USER_FORM_MESSAGE.USER_FORM_UPDATED);
    }

    deleteUserForm = async (id) => {
        let userForm;
        const transaction = await sequelize.transaction();

        try {
            userForm = await UserForm.update({ isDeleted: true }, { where: { id } });
            const userFormId = userForm.id;
            await UserFormDetail.update({ isDeleted: true }, { where: { userFormId } });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }

        return new APIResponse(userForm, httpStatus.OK, USER_FORM_MESSAGE.USER_FORM_DELETED);
    }
}

module.exports = new UserFormService();