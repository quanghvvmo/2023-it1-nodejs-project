import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { ROLES, COMMON_CONSTANTS } from "../constants/index.js";
import { userMessages } from "../constants/messages.constants.js";
import genEmployeeId from "../helper/genEmployeeId.js";

const { User, UserRole, Role, UserForm } = sequelize.models;

const login = async (payload) => {
    const user = await User.findOne({ where: { username: payload.username, isDeleted: false } });
    if (!user) {
        throw new APIError({ message: userMessages.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new APIError({
            message: userMessages.PASSWORDS_NOT_MATCH,
            status: httpStatus.UNAUTHORIZED,
        });
    }

    const jwtToken = jwt.sign({ id: user.id }, config.tokenSecret, {
        expiresIn: config.tokenExpiry,
    });

    delete user.dataValues.password;

    return new ApiDataResponse(httpStatus.OK, userMessages.LOGIN_SUCCEED, {
        user: user.dataValues,
        token: jwtToken,
    });
};

const addUser = async (payload) => {
    // check user exist
    const existingUser = await User.findOne({
        where: { username: payload.username, isDeleted: false },
    });
    if (existingUser) {
        throw new APIError({
            message: userMessages.DUPLICATE_USERNAME,
            status: httpStatus.CONFLICT,
        });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    // gen employeeId
    const lastUser = await User.findOne({
        where: { isDeleted: false },
        order: [["createdAt", "DESC"]],
    });
    if (!lastUser) {
        payload.employeeId = "ID000000";
    } else {
        payload.employeeId = genEmployeeId(lastUser.employeeId);
    }

    const transaction = await sequelize.transaction();
    let newUser;

    try {
        newUser = await User.create(payload, { transaction });

        await UserRole.create({ RoleId: ROLES[payload.role], UserId: newUser.id }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    delete newUser.dataValues.password;

    return new ApiDataResponse(httpStatus.CREATED, userMessages.USER_CREATED, newUser);
};

const getUserDetail = async (userId) => {
    const user = await User.findOne({
        include: [Role],
        where: { id: userId, isDeleted: false },
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new APIError({ message: userMessages.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    return user;
};

const getListUsers = async (pageIndex, pageSize) => {
    const users = await User.findAll({
        attributes: { exclude: ["password"] },
        where: { isDeleted: false },
    });

    const totalCount = users.length;
    if (!totalCount) {
        throw new APIError({ message: userMessages.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
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
        users.slice(startIndex, endIndex)
    );
};

const updateUser = async (userId, payload) => {
    const updatedUser = await User.update(payload, { where: { id: userId, isDeleted: false } });
    if (!updatedUser) {
        throw new APIError({ message: userMessages.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, userMessages.USER_UPDATED, updatedUser);
};

const deleteUser = async (userId) => {
    const transaction = await sequelize.transaction();

    let inactivatedUser;
    try {
        inactivatedUser = await User.update({ isDeleted: true }, { where: { id: userId } });

        await UserForm.update({ isDeleted: true }, { where: { UserId: userId } });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

    return new ApiDataResponse(httpStatus.OK, userMessages.USER_DELETED, inactivatedUser);
};

export { login, addUser, getUserDetail, getListUsers, updateUser, deleteUser };
