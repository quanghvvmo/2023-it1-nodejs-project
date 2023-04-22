const sequelize = require('../models/dbconfig');
const { UserForm, Form, UserFormDetail, FormCategory } = sequelize.models;
const { Op } = require('sequelize');
const userFormTypes = require("../constants/types/userForm");
const APIError = require('../helper/apiError');
const { APIPagingResponse, APIResponse } = require('../helper/apiResponse');
const formMessage = require('../constants/messages/form');
const httpStatus = require('http-status');

class FormService {
    createForm = async (currentUser, data) => {
        const name = data.formCategory;

        const customFormCategory =  {
            model: FormCategory,
            where: { name }
        }

        const existingForm = await UserForm.findAll({
            where: { 
                UserId: [data.UserIds], 
                status: {
                    [Op.in]: [userFormTypes.NEW, userFormTypes.PENDING_APPROVAL]
                }
            },
            include: [ customFormCategory ]
        });

        if(existingForm.length) {
            throw new APIError({
                message: formMessage.USERFORM_NOT_PROCEED,
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
                status: userFormTypes.OPEN,
                FormCategoryId: name
            }, { transaction });
            
            const FormId = form.id;

            for (const UserId of data.userIds) {
                const userForm = await UserForm.create({
                    UserId,
                    FormId,
                    status: userFormTypes.NEW
                }, { transaction });

                const UserFormId = userForm.id;
                await UserFormDetail.create({ UserFormId }, { transaction });
            };

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new APIError({
                message: "Transaction failed",
                status: httpStatus.INTERNAL_SERVER_ERROR,
            });
        }

        return new APIResponse(form, formMessage.FORM_CREATED, httpStatus.CREATED);
    }

    getFormDetail = async (id) => {
        const form = await Form.findOne({
            where: { id, isDeleted: false },
        });
        if (!form) {
            throw new APIError({ message: formMessage.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        return form;
    }

    getListForms = async (pageIndex, pageSize) => {
        const forms = await Form.findAll({ 
            where: { isDeleted: false } 
        });
    
        const numOfForms = forms.length;
        if (!numOfForms) {
            throw new APIError({ message: formMessage.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfForms / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: formMessage.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
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
        }
        const form = await Form.update(updatedData, { where: { id, isDeleted: false } });
        if (!form) {
            throw new APIError({ message: formMessage.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new APIResponse(form, httpStatus.OK, formMessage.FORM_UPDATED);
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
        
        return new APIResponse(form, formMessage.FORM_DELETED, httpStatus.OK);
    }
}

module.exports = new FormService();