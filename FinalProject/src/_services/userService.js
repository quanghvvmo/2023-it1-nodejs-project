import User from "../_database/models/user"
import UserRole from "../_database/models/userRole"
import Role from "../_database/models/role"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
                    errCode: 0,
                    errMsg: "Login successful!"
                })
            }
            return ({
                errCode: 1,
                errMsg: "Password is wrong!"
            })
        }
        return ({
            errCode: -1,
            errMsg: "Your email is not exsit!"
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
                errCode: 1,
                errMsg: "Email is already exsiting"
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
            errCode: 0,
            errMsg: "The new User has been created"
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
                    errCode: 1,
                    errMsg: "User not found!"
                })
            }
            return ({
                errCode: 0,
                errMsg: "User updating succesfull!"
            })
        }
        return ({
            errCode: -1,
            errMsg: "The email is already exsit, Please choose another email!"
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
                errCode: 0,
                errMsg: "The user is soft deleted",
            })
        }
        return ({
            errCode: -1,
            errMsg: "Not found user!"
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
                errCode: 0,
                errMsg: "Ok",
            })
        }
        return ({
            errCode: -1,
            errMsg: "Not found user!"
        })
    }
}

module.exports = new UserService();