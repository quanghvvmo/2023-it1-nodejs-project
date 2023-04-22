import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/index.js";
import APIError from "../helper/apiError.js";
import httpStatus from "http-status";
import sequelize from "../models/index.js";
import { ApiDataResponse, ApiPaginatedResponse } from "../helper/apiResponse.js";
import { Roles } from "../_utils/constants.js";

const { User, UserRole, Role, UserForm } = sequelize.models;

const login = async (payload) => {
    const user = await User.findOne({ where: { username: payload.username } });
    if (!user) {
        throw new APIError({ message: "Username doesn't exist !", status: httpStatus.NOT_FOUND });
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
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

    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    const transaction = await sequelize.transaction();
    let newUser;

    try {
        newUser = await User.create(payload, { transaction });

        await UserRole.create({ RoleId: Roles[payload.role], UserId: newUser.id }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        throw new APIError({
            message: "Transaction got error !",
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    delete newUser.dataValues.password;

    return new ApiDataResponse(httpStatus.CREATED, "create success", newUser);
};

const getUserDetail = async (userId) => {
    const user = await User.findOne({
        include: [Role],
        where: { id: userId, isDeleted: false },
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
        where: { isDeleted: false },
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
    const updatedUser = await User.update(payload, { where: { id: userId, isDeleted: false } });
    if (!updatedUser) {
        throw new APIError({ message: "User not found", status: httpStatus.NOT_FOUND });
    }

    return new ApiDataResponse(httpStatus.OK, "update success", updatedUser);
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

        throw new APIError({
            message: "Transaction got error !",
            status: httpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new ApiDataResponse(httpStatus.OK, "delete success", inactivatedUser);
};

export { login, addUser, getUserDetail, getListUsers, updateUser, deleteUser };
