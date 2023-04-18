import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { FormStatus } from "../_utils/constants.js";
import { FormCategories, UserFormStatus } from "../_utils/constants.js";

const { Form, UserForm, UserFormDetail } = sequelize.models;

const addForm = async (currentUser, payload) => {
    let newForm;
    const transaction = await sequelize.transaction();

    try {
        newForm = await Form.create(
            {
                ...payload,
                createBy: currentUser.id,
                status: FormStatus.OPEN,
                FormCategoryId: FormCategories[payload.formCategory],
            },
            { transaction }
        );

        await Promise.all(
            payload.userIds.map(async (userFormId) => {
                const newUserForm = await UserForm.create(
                    {
                        UserId: userFormId,
                        FormId: newForm.id,
                        status: UserFormStatus.NEW,
                    },
                    { transaction }
                );

                await UserFormDetail.create({ UserFormId: newUserForm.id }, { transaction });
            })
        );

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

        await UserForm.update({ isDeleted: true }, { where: { FormId: formId } });

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
