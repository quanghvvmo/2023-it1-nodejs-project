import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import {
    FORM_STATUS,
    USER_FORM_STATUS,
    FORM_CATEGORIES,
    COMMON_CONSTANTS,
} from "../constants/index.js";
import { formMessages } from "../constants/messages.constants.js";
import mailSender from "../helper/mail-sender.js";
import { SUBJECT, CONTENT } from "../constants/mailSender.constants.js";

const { User, Form, UserForm, UserFormDetail, FormCategory } = sequelize.models;

const addForm = async (currentUser, payload) => {
    // Each user only has 1 type of form haven't closed
    const formsInvalid = await UserForm.findAll({
        attributes: ["id"],
        where: {
            UserId: payload.userIds,
            status: [USER_FORM_STATUS.NEW, USER_FORM_STATUS.SUBMITTED],
            isDeleted: false,
        },
        include: [
            {
                model: Form,
                include: { model: FormCategory, where: { name: payload.formCategory } },
            },
        ],
    });

    if (formsInvalid.length) {
        throw new APIError({
            message: formMessages.SINGLE_OPEN_FORM_LIMITATION,
            status: httpStatus.BAD_REQUEST,
        });
    }

    // create form
    let newForm;
    const transaction = await sequelize.transaction();

    try {
        newForm = await Form.create(
            {
                ...payload,
                createBy: currentUser.id,
                status: FORM_STATUS.OPEN,
                FormCategoryId: FORM_CATEGORIES[payload.formCategory],
            },
            { transaction }
        );

        const userForms = await Promise.all(
            payload.userIds.map(async (userId) => {
                const { ManagerId } = await User.findOne({
                    attributes: ["ManagerId"],
                    where: { id: userId },
                });

                return {
                    UserId: userId,
                    FormId: newForm.id,
                    status: USER_FORM_STATUS.NEW,
                    ManagerId,
                };
            })
        );

        await UserForm.bulkCreate(userForms, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    // send mails
    const emails = await Promise.all(
        payload.userIds.map(async (userId) => {
            const { email } = await User.findOne({
                attributes: ["email"],
                where: { id: userId },
            });
            return email;
        })
    );
    mailSender(emails, SUBJECT(payload.formCategory), CONTENT);

    return new ApiDataResponse(httpStatus.CREATED, formMessages.FORM_CREATED, newForm);
};

const getForm = async (formId) => {
    const form = await Form.findOne({
        where: { id: formId, isDeleted: false },
    });

    if (!form) {
        throw new APIError({ message: formMessages.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    return form;
};

const getListForms = async (pageIndex, pageSize) => {
    const forms = await Form.findAll({
        where: { isDeleted: false },
    });

    const totalCount = forms.length;
    if (!totalCount) {
        throw new APIError({ message: formMessages.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    if (pageIndex > totalPages) {
        throw new APIError({
            message: COMMON_CONSTANTS.INVALID_PAGE,
            status: httpStatus.BAD_REQUEST,
        });
    }

    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return new ApiPaginatedResponse(
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
        forms.slice(startIndex, endIndex)
    );
};

const updateForm = async (currentUser, formId, payload) => {
    const updatedForm = await Form.update(
        { ...payload, updateBy: currentUser.id },
        { where: { id: formId, isDeleted: false } }
    );

    if (!updatedForm) {
        throw new APIError({ message: formMessages.FORM_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, formMessages.FORM_UPDATED, updatedForm);
};

const deleteForm = async (formId) => {
    let deletedForm;
    const transaction = await sequelize.transaction();

    try {
        deletedForm = await Form.update({ isDeleted: true }, { where: { id: formId } });

        await UserForm.update({ isDeleted: true }, { where: { FormId: formId } });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    return new ApiDataResponse(httpStatus.OK, formMessages.FORM_DELETED, deletedForm);
};

export { addForm, getForm, getListForms, updateForm, deleteForm };
