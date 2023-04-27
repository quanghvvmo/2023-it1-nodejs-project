const sequelize = require('../models/helper/dbconfig');
const { UserForm, UserFormDetail } = sequelize.models;
const APIError = require('../helper/apiError');
const httpStatus = require('http-status');
const { USER_FORM_DETAIL_MESSAGE, USER_FORM_MESSAGE } = require('../constants/messages');
const { APIResponse, APIPagingResponse } = require('../helper/apiResponse');
const { USER_FORM_TYPES } = require("../config/constants");

class UserFormDetailService {
    createUserFormDetail = async (UserFormId, data) => {
        const transaction = await sequelize.transaction();
        let userFormDetail;
    
        try {
            userFormDetail = await UserFormDetail.create({ ...data, UserFormId });
    
            const userForm = await UserForm.update(
                { status: USER_FORM_TYPES.PENDING_APPROVAL },
                {
                    where: { id: UserFormId, isDeleted: false },
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
}     

module.exports = new UserFormDetailService();