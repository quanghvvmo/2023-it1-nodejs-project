import {
    login,
    addUser,
    getUserDetail,
    getListUsers,
    updateUser,
    deleteUser,
} from "../services/user.service.js";
import httpStatus from "http-status";
import { createUserSchema, updateUserSchema, loginSchema } from "../validations/user.validation.js";
import config from "../config/index.js";

const loginController = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const token = await login(value);
        return res.status(httpStatus.OK).json({ token });
    } catch (error) {
        next(error);
    }
};

const addUserController = async (req, res, next) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const createdUser = await addUser(value);
        return res.status(httpStatus.CREATED).json(createdUser);
    } catch (error) {
        next(error);
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const { error, value } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const userId = req.params.id;

        const updatedUserId = await updateUser(userId, value);
        return res.status(httpStatus.OK).json(updatedUserId);
    } catch (error) {
        next(error);
    }
};

const getUserDetailController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await getUserDetail(userId);
        return res.status(httpStatus.OK).json(user);
    } catch (error) {
        next(error);
    }
};

const getListUsersController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const users = await getListUsers(pageIndex, pageSize);
        return res.status(httpStatus.OK).json(users);
    } catch (error) {
        next(error);
    }
};

const deleteUserController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await deleteUser(userId);
        return res.status(httpStatus.OK).json(user);
    } catch (error) {
        next(error);
    }
};

export {
    loginController,
    addUserController,
    getUserDetailController,
    getListUsersController,
    updateUserController,
    deleteUserController,
};
