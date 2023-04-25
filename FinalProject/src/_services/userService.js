import User from "../_database/models/user"
import UserRole from "../_database/models/userRole"
import Role from "../_database/models/role"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_MESSAGE } from "../common/userMessage"
import { ERR_CODE } from "../common/errCode";
import status from "http-status";
require("dotenv").config();

var hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}
class UserService {

    handleLogin = async (data) => {
        let user = await User.findOne({
            where: {
                email: data.email
            }
        })
        if (user) {
            let check = bcrypt.compareSync(data.password, user.password)
            if (check) {
                const token = jwt.sign(
                    { userId: user.id },
                    process.env.SECRET_KEY
                )
                return ({
                    user,
                    token,
                    errCode: ERR_CODE.OK,
                    errMsg: USER_MESSAGE.LOGIN_SUCCEED,
                    status: status.OK
                })
            }
            return ({
                errCode: ERR_CODE.ERROR_FROM_CLIENT,
                errMsg: USER_MESSAGE.PASSWORDS_WRONG,
                status: status.UNAUTHORIZED
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    createUser = async (data, avatar) => {
        let existUser = await User.findOne({
            where: {
                email: data.email
            }
        })
        if (existUser) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_CLIENT,
                errMsg: USER_MESSAGE.DUPLICATE_EMAIL,
                status: status.CONFLICT
            })
        }
        let passwordHahsed = await hashUserPassword(data.password);
        const newUser = await User.create({
            ...data,
            password: passwordHahsed,
            avatar: avatar,
        })
        return ({
            newUser,
            errCode: ERR_CODE.OK,
            errMsg: USER_MESSAGE.USER_CREATED,
            status: status.CREATED
        })
    }

    updateUser = async (data, avatar) => {
        let emailExist = await User.findOne({
            where: {
                email: data.email,
            },
            raw: false
        })
        if (!emailExist) {
            let passwordHahsed = await hashUserPassword(data.password)
            const user = await User.update(
                {
                    ...data,
                    password: passwordHahsed,
                    avatar: avatar
                },
                {
                    where: {
                        id: data.id,
                        isDeleted: 0
                    }
                }
            );
            if (!user) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_CLIENT,
                    errMsg: USER_MESSAGE.USER_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            return ({
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_UPDATED,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.DUPLICATE_EMAIL,
            status: status.CONFLICT
        })
    }

    softDelete = async (userid) => {
        let user = await User.findOne({
            where: {
                id: userid,
                isDeleted: 0
            },
            raw: false
        })
        if (user) {
            user.isDeleted = 1;
            await user.save();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_DELETED,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    getUserById = async (userId) => {
        const user = await User.findAll({
            where: {
                id: userId
            },
            include: [
                {
                    model: UserRole,
                    include: [
                        {
                            model: Role,
                            as: "roleData",
                            attributes: ["name"],
                        },
                    ],
                    attributes: ["roleid"],
                    as: "userRole"
                },
            ],
            raw: true,
            nest: true
        })
        if (user && user.length > 0) {
            return ({
                user,
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_FOUND,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }
}

module.exports = new UserService();