const sequelize = require("./models/helper/dbconfig.js");
const { UserForm, Form, UserFormDetail, FormCategory } = sequelize.models;
const { Op } = require('sequelize');
const { USER_FORM_TYPES } = require("../config/constants");
const APIError = require('../helper/apiError');
const { APIPagingResponse, APIResponse } = require('../helper/apiResponse');
const { FORM_MESSAGES } = require('../constants/messages');
const httpStatus = require('http-status');

class FormService {
    createForm = async (currentUser, data) => {
        const name = data.formCategory;

        const existingForm = await UserForm.findAll({
            where: { 
                UserId: [data.UserIds], 
                status: {
                    [Op.in]: [USER_FORM_TYPES.NEW, USER_FORM_TYPES.PENDING_APPROVAL]
                },
                isDeleted: false
            },
            include: [ 
                {
                    model: Form,
                    include: [
                        { 
                            model: FormCategory,
                            where: { name } 
                        }
                    ]
                }
            ]
        });

        if(existingForm.length) {
            throw new APIError({
                message: FORM_MESSAGES.USERFORM_NOT_PROCEED,
                status: httpStatus.CONFLICT,
            });
        }

        const transaction = await sequelize.transaction();
        let form;   

        const creator = currentUser.id;

        try {
            form = await Form.create({
                ...data,
                creator,
                status: USER_FORM_TYPES.OPEN,
                FormCategoryId: name
            }, { transaction });
            
            const FormId = form.id;

            const userForms = data.userIds.map((UserId) => (
                {
                    UserId,
                    FormId,
                    status: USER_FORM_TYPES.NEW
                }
            ));

            const createdUserForms = await UserForm.bulkCreate(userForms, { transaction });

            const userFormIds = createdUserForms.map((createdUserForm) => createdUserForm.id);
  
            const userFormDetails = userFormIds.map((UserFormId) => (
                { 
                    UserFormId 
                }
            ));

            await UserFormDetail.bulkCreate(userFormDetails, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new APIError({
                message: "Transaction failed",
                status: httpStatus.INTERNAL_SERVER_ERROR,
            });
        }

        return new APIResponse(form, FORM_MESSAGES.FORM_CREATED, httpStatus.CREATED);
    }

    getFormDetail = async (id) => {
        const form = await Form.findOne({
            where: { id, isDeleted: false },
        });
        if (!form) {
            throw new APIError({ message: FORM_MESSAGES.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        return form;
    }

    getListForms = async (pageIndex, pageSize) => {
        const forms = await Form.findAll({ 
            where: { isDeleted: false } 
        });
    
        const numOfForms = forms.length;
        if (!numOfForms) {
            throw new APIError({ message: FORM_MESSAGES.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfForms / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: FORM_MESSAGES.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
        }
    
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
    
        return new APIPagingResponse(
            forms.slice(start, end),
            pageIndex,
            pageSize,
            numOfForms,
            totalPages,
        );
    }

    updateForm = async (currentUser, id, data) => {
        const updatedData = { 
            ...data, 
            updateBy: currentUser.id 
        };

        const form = await Form.update(updatedData, { where: { id, isDeleted: false } });
        
        if (!form) {
            throw new APIError({ message: FORM_MESSAGES.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new APIResponse(form, httpStatus.OK, FORM_MESSAGES.FORM_UPDATED);
    }

    deleteForm = async (id) => {
        const transaction = await sequelize.transaction();
        let form;

        try {
            form = await Form.update({ isDeleted: true }, { where: { id } });
            const userForm = await UserForm.update({ isDeleted: true }, { where: { FormId: id } });
            const UserFormId = userForm.id;
            await UserFormDetail.update({ isDeleted: true }, { where: { UserFormId } });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new APIError({
                message: "Transaction failed",
                status: httpStatus.INTERNAL_SERVER_ERROR,
            });
        }
        
        return new APIResponse(form, FORM_MESSAGES.FORM_DELETED, httpStatus.OK);
    }
}

module.exports = new FormService();