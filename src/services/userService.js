const sequelize = require("../models/helper/dbconfig");
const APIError = require('../helper/apiError');
const { USER_MESSAGES } = require('../constants/messages');
const httpStatus = require('http-status');
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const { APIResponse, APIPagingResponse } = require("../helper/apiResponse");
const { User, Role, UserRole, UserForm } = sequelize.models;
const { generateEmployeeCode } = require('../helper/genEmployeeCode');

class UserService {
    login = async (data) => {
        const { username, password } = data;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new APIError({ message:USER_MESSAGES.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
        if (!user.checkPassword(password)) {
            throw new APIError({ message:USER_MESSAGES.PASSWORDS_DONT_MATCH, status: httpStatus.UNAUTHORIZED });
        }
        const { id } = user;
        const userPayload = { id }
        const token = jwt.sign(userPayload, config.tokenSecret, {
            expiresIn: config.tokenExpiry
        })
        return new APIResponse({ token }, httpStatus.OK, USER_MESSAGES.LOGIN_SUCCEED);
    }

    getUserDetail = async (id) => {
        const user = await User.findOne({ 
            include: [Role], 
            where: { id, isDeleted: false } 
        });
        if (!user) {
            throw new APIError({ message: USER_MESSAGES.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return user;
    };

    getUserInfo = async (currentUser) => {
        if(!currentUser) {
            throw new APIError({ message: USER_MESSAGES.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }

        return currentUser;
    }
    
    getListUsers = async (pageIndex, pageSize) => {
        const users = await User.findAll({
            where: { isDeleted: false }
        })

        const numOfUsers = users.length;
        if (!numOfUsers) {
            throw new APIError({ message: USER_MESSAGES.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        const totalPages = parseInt((numOfUsers / pageSize) + 1);
        if (pageIndex > totalPages) {
            throw new APIError({ message: USER_MESSAGES.INVALID_PAGGING, status: httpStatus.BAD_REQUEST });
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
        const name = data.role;
        const employeeCode = generateEmployeeCode();

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new APIError({ message: USER_MESSAGES.USER_EXISTS, status: httpStatus.CONFLICT });
        }
        const role = await Role.findOne({
            where: { name }
        });
        const roleId = role.id;

        const transaction = await sequelize.transaction();
        let user;
        try {
            user = await User.create({ ...data, employeeCode }, { transaction });
            const userId = user.id;
            await UserRole.create({ roleId, userId }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.log(error)
            throw new APIError({
                message: "Transaction failed",
                status: httpStatus.INTERNAL_SERVER_ERROR
            });
        }
        return new APIResponse(user, httpStatus.CREATED, USER_MESSAGES.USER_CREATED);
    }
    
    updateUser = async (id, data) => {
        const user = await User.update(data, { where: { id, isDeleted: false } });
        if (!user) {
            throw new APIError({ message: USER_MESSAGES.USER_NOT_FOUND, status: httpStatus.NOT_FOUND });
        }
    
        return new APIResponse(user, httpStatus.OK, USER_MESSAGES.USER_UPDATED);
    };
    
    deleteUser = async (id) => {
        const transaction = await sequelize.transaction();

        let user;
        try {
            user = await User.update({ isDeleted: true }, { where: { id } });
            await UserForm.update({ isDeleted: true }, { where: { userId: id } });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new APIError({
                message: "Transaction failed",
                status: httpStatus.INTERNAL_SERVER_ERROR,
            });
        }

        return new APIResponse(user, httpStatus.OK, USER_MESSAGES.USER_DELETED);
    };
}

module.exports = new UserService();