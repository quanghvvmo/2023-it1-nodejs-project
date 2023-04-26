import { Op } from "sequelize";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { ROLES, COMMON_CONSTANTS } from "../constants/index.js";
import { userFormMessages } from "../constants/messages.constants.js";

const { UserForm, UserFormDetail } = sequelize.models;

const getUserForm = async (currentUser, userFormId) => {
    const isHrOrAdmin = currentUser.Roles.some(
        (role) => role.id === ROLES["HR"] || role.id === ROLES["ADMIN"]
    );

    const userForm = await UserForm.findOne({
        include: [UserFormDetail],
        where: {
            id: userFormId,
            isDeleted: false,
            [Op.or]: [
                { UserId: currentUser.id },
                { ManagerId: currentUser.id },
                isHrOrAdmin && { isDeleted: false },
            ],
        },
    });

    if (!userForm) {
        throw new APIError({
            message: userFormMessages.USER_FORM_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
    }

    return userForm;
};

const getListUserForms = async (currentUser, pageIndex, pageSize) => {
    const isHrOrAdmin = currentUser.Roles.some(
        (role) => role.id === ROLES["HR"] || role.id === ROLES["ADMIN"]
    );

    const userForms = await UserForm.findAll({
        include: [UserFormDetail],
        where: {
            isDeleted: false,
            [Op.or]: [
                { UserId: currentUser.id },
                { ManagerId: currentUser.id },
                isHrOrAdmin && { isDeleted: false },
            ],
        },
    });

    const totalCount = userForms.length;
    if (!totalCount) {
        throw new APIError({
            message: userFormMessages.USER_FORM_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
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
        userForms.slice(startIndex, endIndex)
    );
};

const updateUserForm = async (userFormId, payload) => {
    const updatedUserForm = await UserForm.update(payload, {
        where: { id: userFormId, isDeleted: false },
    });
    if (!updatedUserForm) {
        throw new APIError({
            message: userFormMessages.USER_FORM_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
    }

    return new ApiDataResponse(httpStatus.OK, userFormMessages.USER_FORM_UPDATED, updatedUserForm);
};

const deleteUserForm = async (userFormId) => {
    let deletedUserForm;
    const transaction = await sequelize.transaction();

    try {
        deletedUserForm = await UserForm.update({ isDeleted: true }, { where: { id: userFormId } });

        await UserFormDetail.update({ isDeleted: true }, { where: { UserFormId: userFormId } });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        throw new APIError({
            message: COMMON_CONSTANTS.TRANSACTION_ERROR,
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new ApiDataResponse(httpStatus.OK, userFormMessages.USER_FORM_DELETED, deletedUserForm);
};

export { getUserForm, getListUserForms, updateUserForm, deleteUserForm };
