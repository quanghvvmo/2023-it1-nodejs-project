import httpStatus from "http-status";
import sequelize from "../models/index.js";
import APIError from "../helper/apiError.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { USER_FORM_STATUS, COMMON_CONSTANTS } from "../constants/index.js";
import { userFormDetailMessages, userFormMessages } from "../constants/messages.constants.js";

const { UserForm, UserFormDetail } = sequelize.models;

const addUserFormDetail = async (userFormId, payload) => {
    const transaction = await sequelize.transaction();
    let newUserFormDetail;

    try {
        newUserFormDetail = await UserFormDetail.create({ ...payload, UserFormId: userFormId });

        const updatedUserForm = await UserForm.update(
            { status: USER_FORM_STATUS.SUBMITTED },
            {
                where: { id: userFormId, isDeleted: false },
            }
        );
        if (!updatedUserForm) {
            throw new APIError({
                message: userFormMessages.USER_FORM_NOT_FOUND,
                status: httpStatus.NOT_FOUND,
            });
        }
    } catch (error) {
        if (error instanceof APIError) throw error;
        await transaction.rollback();

        throw new APIError({
            message: COMMON_CONSTANTS.TRANSACTION_ERROR,
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new ApiDataResponse(
        httpStatus.CREATED,
        userFormDetailMessages.USER_FORM_DETAIL_CREATED,
        newUserFormDetail
    );
};

const getUserFormDetail = async (userFormDetailId) => {
    const userFormDetail = await UserFormDetail.findOne({
        where: {
            id: userFormDetailId,
            isDeleted: false,
        },
    });

    if (!userFormDetail) {
        throw new APIError({
            message: userFormDetailMessages.USER_FORM_DETAIL_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
    }

    return userFormDetail;
};

const getListUserFormsDetail = async (pageIndex, pageSize) => {
    const userFormDetails = await UserFormDetail.findAll({ where: { isDeleted: false } });

    const totalCount = userFormDetails.length;
    if (!totalCount) {
        throw new APIError({
            message: userFormDetailMessages.USER_FORM_DETAIL_NOT_FOUND,
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
        userFormDetails.slice(startIndex, endIndex)
    );
};

const updateUserFormDetail = async (userFormDetailId, payload) => {
    const updatedUserFormDetail = await UserFormDetail.update(payload, {
        where: { id: userFormDetailId, isDeleted: false },
    });
    if (!updatedUserFormDetail) {
        throw new APIError({
            message: userFormDetailMessages.USER_FORM_DETAIL_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
    }

    return new ApiDataResponse(
        httpStatus.OK,
        userFormDetailMessages.USER_FORM_DETAIL_UPDATED,
        updatedUserFormDetail
    );
};

const deleteUserFormDetail = async (userFormDetailId) => {
    const deletedUserFormDetail = await UserFormDetail.update(
        { isDeleted: true },
        { where: { id: userFormDetailId } }
    );
    if (!deletedUserFormDetail) {
        throw new APIError({
            message: userFormDetailMessages.USER_FORM_DETAIL_NOT_FOUND,
            status: httpStatus.NOT_FOUND,
        });
    }

    return new ApiDataResponse(
        httpStatus.OK,
        userFormDetailMessages.USER_FORM_DETAIL_DELETED,
        deletedUserFormDetail
    );
};

export {
    addUserFormDetail,
    updateUserFormDetail,
    deleteUserFormDetail,
    getUserFormDetail,
    getListUserFormsDetail,
};
