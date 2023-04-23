import { Op } from "sequelize";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { ROLES, FORM_STATUS, USER_FORM_STATUS, FORM_CATEGORIES } from "../_utils/constants.js";

const { UserForm, UserFormDetail } = sequelize.models;

const getUserForm = async (currentUser, userFormId) => {
    const isHrOrAdmin = currentUser.Roles.some(
        (role) => role.id === ROLES["hr"] || role.id === ROLES["admin"]
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
        throw new APIError({ message: "UserForm not found !", status: httpStatus.NOT_FOUND });
    }

    return userForm;
};

export { getUserForm };
