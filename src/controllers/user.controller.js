import {
    login,
    addUser,
    getUserDetail,
    getListUsers,
    updateUser,
    activeUser,
    inactiveUser,
    hardDeleteUser,
} from "../services/user.service.js";
import httpStatus from "http-status";
import { createUserSchema, updateUserSchema, loginSchema } from "../validations/user.validation.js";
import config from "../config/index.js";

const loginController = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
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
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const createdUserId = await addUser(value);
        return res.status(httpStatus.CREATED).json(createdUserId);
    } catch (error) {
        next(error);
    }
};

const updateUserController = async (req, res, next) => {
    try {
        const { error, value } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const updatedUserId = await updateUser(req.params.id, value);
        return res.status(httpStatus.OK).json(updatedUserId);
    } catch (error) {
        next(error);
    }
};

const getUserDetailController = async (req, res, next) => {
    try {
        console.log(req.params.id);

        const user = await getUserDetail(req.params.id);
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

const activeUserController = async (req, res, next) => {
    try {
        const userId = await activeUser(req.params.id);
        return res.status(httpStatus.OK).json(userId);
    } catch (error) {
        next(error);
    }
};

const inactiveUserController = async (req, res, next) => {
    try {
        const userId = await inactiveUser(req.params.id);
        return res.status(httpStatus.OK).json(userId);
    } catch (error) {
        next(error);
    }
};

const hardDeleteUserController = async (req, res, next) => {
    try {
        const userId = await hardDeleteUser(req.params.id);
        return res.status(httpStatus.OK).json(userId);
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
    activeUserController,
    inactiveUserController,
    hardDeleteUserController,
};
