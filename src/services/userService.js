const sequelize = require("../models/dbconfig")
const APIError = require('../helper/apiError');
const userMessage = require('../constants/userMessage');
const httpStatus = require('http-status');
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const { APIResponse, APIPagingResponse } = require("../helper/apiResponse");
const { User } = sequelize.models;

class UserService {
    login = async (data) => {
        const { username } = data;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new APIError(userMessage.USER_NOT_FOUND, httpStatus.NOT_FOUND);
        }
        if (user.password !== data.password) {
            throw new APIError(userMessage.PASSWORDS_DONT_MATCH, httpStatus.UNAUTHORIZED);
        }
        const { id } = user;
        const userPayload = { id }
        const token = jwt.sign(userPayload, config.token_secret, {
            expiresIn: config.token_expiry
        })
        return new APIResponse({ token }, httpStatus.OK, userMessage.LOGIN_SUCCEED);
    }

    getUserDetail = async (id) => {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return user;
    };
    
    getListUsers = async (pageIndex, pageSize) => {
        const users = await User.findAll();
    
        const numOfUsers = users.length;
        if (!numOfUsers) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfUsers / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: userMessage.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
        }
    
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
    
        return new APIPagingResponse(
            users.slice(start, end),
            pageIndex,
            pageSize,
            numOfUsers,
            totalPages,
        );
    };

    createUser = async (data) => {
        const { username } = data;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new APIError({ message: userMessage.USER_EXISTS, status: httpStatus.CONFLICT });
        }

        const user = await User.create(data);

        return new APIResponse(user, httpStatus.CREATED, userMessage.USER_CREATED);
    }
    
    updateUser = async (id, data) => {
        const user = await User.update(data, { where: { id } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new APIResponse(user, httpStatus.OK, userMessage.USER_UPDATED);
    };
    
    deleteUser = async (userId) => {
        const user = await User.update({ isDeleted: true }, { where: { id: userId } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new ApiDataResponse(user, httpStatus.OK, userMessage.USER_DELETED);
    };
}

module.exports = new UserService();