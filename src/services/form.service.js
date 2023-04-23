import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { FORM_STATUS, USER_FORM_STATUS, FORM_CATEGORIES } from "../_utils/constants.js";

const { Form, UserForm, UserFormDetail, FormCategory } = sequelize.models;

const addForm = async (currentUser, payload) => {
    // Each user only has 1 type of form haven't closed
    const formsInvalid = await UserForm.findAll({
        where: {
            UserId: payload.userIds,
            status: [USER_FORM_STATUS.NEW, USER_FORM_STATUS.SUBMITTED],
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
            message: "Each user only has 1 type of form haven't closed",
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

        const userForms = payload.userIds.map((userId) => ({
            UserId: userId,
            FormId: newForm.id,
            status: USER_FORM_STATUS.NEW,
        }));

        await UserForm.bulkCreate(userForms, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        throw new APIError({
            message: "Transaction got error !",
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new ApiDataResponse(httpStatus.CREATED, "create success", newForm);
};

const getForm = async (formId) => {
    const form = await Form.findOne({
        where: { id: formId, isDeleted: false },
    });

    if (!form) {
        throw new APIError({ message: "Form not found !", status: httpStatus.NOT_FOUND });
    }

    return form;
};

const getListForms = async (pageIndex, pageSize) => {
    const forms = await Form.findAll({
        where: { isDeleted: false },
    });

    const totalCount = forms.length;
    if (!totalCount) {
        throw new APIError({ message: "Forms not found !", status: httpStatus.NOT_FOUND });
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    if (pageIndex > totalPages) {
        throw new APIError({ message: "Invalid page index", status: httpStatus.BAD_REQUEST });
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
        throw new APIError({ message: "Form not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedForm);
};

const deleteForm = async (formId) => {
    let deletedForm;
    const transaction = await sequelize.transaction();

    try {
        deletedForm = await Form.update({ isDeleted: true }, { where: { id: formId } });

        const userFormDeleted = await UserForm.update(
            { isDeleted: true },
            { where: { FormId: formId }, returning: true, plain: true }
        );

        await UserFormDetail.update(
            { isDeleted: true },
            { where: { UserFormId: userFormDeleted.id } }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        throw new APIError({
            message: "Transaction got error !",
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new ApiDataResponse(httpStatus.OK, "delete success", deletedForm);
};

export { addForm, getForm, getListForms, updateForm, deleteForm };
