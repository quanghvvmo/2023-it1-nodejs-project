const sequelize = require('../models/dbconfig');
const { User, Customer } = sequelize.models;
const APIError = require('../helper/apiError');
const { ApiResponse, ApiPagingResponse } = require('../helper/apiResponse');
const userMessage = require('../constants/userMessage');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

class UserService {
    login = async (data) => {
        const { username, password } = data;
        const user = await User.findOne({ 
            where: { username } 
        });
        if(!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        if(!user.checkPassword(password, user.password)) {
            throw new APIError({ message: userMessage.PASSWORDS_DONT_MATCH, status: httpStatus.UNAUTHORIZED });
        }
        const id = user.id;
        const token = jwt.sign({ id }, config.token_secret, { expiresIn: config.token_expiry });
        return new ApiResponse({ token }, userMessage.LOGIN_SUCCEED, httpStatus.OK);
    }

    createUser = async (data) => {
        const { username } = data;
        const currentUser = await User.findOne({ where: { username } });
        if(currentUser) {
            throw new APIError({ message: userMessage.DUPLICATE_USERNAME, status: httpStatus.CONFLICT });
        }
        const user = await User.create(data);
        return new ApiResponse(user, userMessage.USER_CREATED, httpStatus.CREATED);
    }

    updateUser = async (id, data) => {
        const user = await User.update(data, { where: { id } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        
        return new ApiResponse(user, httpStatus.OK, userMessage.USER_UPDATED);
    };

    inactiveUser = async (id) => {
        const user = await User.update({ isActive: false }, { where: { id} });
        if (!user.at(0)) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return new ApiResponse(user, httpStatus.OK, userMessage.USER_INACTIVE);
    };

    activeUser = async (id) => {
        const user = await User.update({ isActive: true }, { where: { id } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        
        return new ApiResponse(user, httpStatus.OK, userMessage.USER_ACTIVE);
    };

    getListUsers = async (pageIndex, pageSize) => {
        const users = await User.findAll();
    
        const numOfUsers = users.length;
        if (!numOfUsers) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPage = parseInt((numOfUsers / pageSize) + 1);
        console.log(69, pageSize, totalPage)
        if (pageIndex > totalPage) {
            throw new APIError({ message: userMessage.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
        }
    
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
    
        return new ApiPagingResponse(
            users.slice(start, end),
            pageIndex,
            pageSize,
            numOfUsers,
            totalPage,
        );
    };

    getUserDetail = async (id) => {
        const user = await User.findOne({
            include: [Customer],
            where: { id },
        });
    
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        return user;
    };

    deleteUser = async (id) => {
        await Customer.destroy({ where: { userId: id } });
        const user = await User.destroy({ where: { id } });
        if (!user) {
            throw new APIError({ message: userMessage.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new ApiResponse(user, httpStatus.OK, userMessage.USER_DELETED);
    };

}

module.exports = new UserService();