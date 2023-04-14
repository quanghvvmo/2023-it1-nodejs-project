import jwt from "jsonwebtoken";
import config from "../config/index.js";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";

const { User } = sequelize.models;

const login = async (payload) => {
    const user = await User.findOne({ where: { username: payload.username } });
    if (!user) {
        throw new APIError({ message: "Username doesn't exist !", status: httpStatus.NOT_FOUND });
    }

    if (user.password !== payload.password) {
        throw new APIError({ message: "Incorrect password !", status: httpStatus.UNAUTHORIZED });
    }

    const jwtToken = jwt.sign({ id: user.id }, config.token_secret, {
        expiresIn: config.token_expiry,
    });
    return new ApiDataResponse(httpStatus.OK, "login success", { token: jwtToken });
};

const addUser = async (payload) => {
    const existingUser = await User.findOne({ where: { username: payload.username } });
    if (existingUser) {
        throw new APIError({ message: "User already exist !", status: httpStatus.CONFLICT });
    }

    const newUser = await User.create(payload);
    delete newUser.dataValues.password;

    return new ApiDataResponse(httpStatus.CREATED, "create success", newUser);
};

const getUserDetail = async (userId) => {
    const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        throw new APIError({ message: "User not found !", status: httpStatus.NOT_FOUND });
    }

    return user;
};

const getListUsers = async (pageIndex, pageSize) => {
    const users = await User.findAll({
        attributes: { exclude: ["password"] },
    });

    const totalCount = users.length;
    if (!totalCount) {
        throw new APIError({ message: "Users not found !", status: httpStatus.NOT_FOUND });
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
        users.slice(startIndex, endIndex)
    );
};

const updateUser = async (userId, payload) => {
    const updatedUser = await User.update(payload, { where: { id: userId } });
    if (!updatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedUser);
};

const activeUser = async (userId) => {
    const activatedUser = await User.update({ isActive: true }, { where: { id: userId } });
    if (!activatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "active success", activatedUser);
};

const inactiveUser = async (userId) => {
    const inactivatedUser = await User.update({ isActive: false }, { where: { id: userId } });
    if (!inactivatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "inactive success", inactivatedUser);
};

export {
    login,
    addUser,
    getUserDetail,
    getListUsers,
    updateUser,
    activeUser,
    inactiveUser,
};
