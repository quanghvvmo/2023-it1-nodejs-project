const sequelize = require('../models/helper/dbconfig');
const { UserForm, UserFormDetail } = sequelize.models;
const APIError = require('../helper/apiError');
const httpStatus = require('http-status');
const { USER_FORM_DETAIL_MESSAGE, USER_FORM_MESSAGE } = require('../constants/messages');
const { APIResponse, APIPagingResponse } = require('../helper/apiResponse');
const { USER_FORM_TYPES } = require("../config/constants");

class UserFormDetailService {
    createUserFormDetail = async (userFormId, data) => {
        const transaction = await sequelize.transaction();
        let userFormDetail;
    
        try {
            userFormDetail = await UserFormDetail.create({ ...data, userFormId });
    
            const userForm = await UserForm.update(
                { status: USER_FORM_TYPES.SUBMITTED },
                {
                    where: { id: userFormId, isDeleted: false },
                }
            );
            if (!userForm) {
                throw new APIError({ message: USER_FORM_MESSAGE.USER_FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
            }
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    
        return new APIResponse(userFormDetail, httpStatus.CREATED, USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_CREATED);
    };

    getUserFormDetail = async (id) => {
        const userFormDetail = await UserFormDetail.findOne({
            where: {
                id,
                isDeleted: false
            }
        });

        if(!userFormDetail) {
            throw new APIError({ message: USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return userFormDetail;
    }

    getListUserFormDetails = async (pageIndex, pageSize) => {
        const userFormDetails = await UserFormDetail.findAll({
            where: {
                isDeleted: false
            }
        });

        const numOfForms = userFormDetails.length;
        if (!numOfForms) {
            throw new APIError({ message: USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfForms / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: USER_FORM_DETAIL_MESSAGE.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
        }
    
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
    
        return new APIPagingResponse(
            userFormDetails.slice(start, end),
            pageIndex,
            pageSize,
            numOfForms,
            totalPages,
        );
    }

    updateUserFormDetail = async (id, data) => {
        const userFormDetail = await UserFormDetail.update(data, {
            where: { id, isDeleted: false },
        });

        if(!userFormDetail) {
            throw new APIError({ message: USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return new APIResponse(userFormDetail, USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_UPDATED, httpStatus.OK);
    }

    deleteUserFormDetail = async (id) => {
        const userFormDetail = await UserFormDetail.update({ isDeleted: true }, {
            where: { id },
        });

        if(!userFormDetail) {
            throw new APIError({ message: USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return new APIResponse(userFormDetail, USER_FORM_DETAIL_MESSAGE.USER_FORM_DETAIL_DELETED, httpStatus.OK);
    }
}     

module.exports = new UserFormDetailService();