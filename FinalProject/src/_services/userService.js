import User from '../_database/models/user'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
require('dotenv').config();

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
                    errMsg: 'Login successful!'
                })
            } else {
                return ({
                    errCode: 1,
                    errMsg: "Password is wrong!"
                })
            }
        } else {
            return ({
                errCode: -1,
                errMsg: "Your email is not exsit!"
            })
        }
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
                errMsg: 'Email is already exsiting'
            })
        } else {
            let passwordHahsed = await hashUserPassword(data.password);
            const newUser = await User.create({
                empCode: data.empCode,
                email: data.email,
                password: passwordHahsed,
                firstname: data.firstname,
                lastname: data.lastname,
                age: data.age,
                phone: data.phone,
                address: data.address,
                bhxh: data.bhxh,
                avatar: avatar,
                isDeleted: data.isDeleted
            })
            return ({
                newUser,
                errCode: 0,
                errMsg: 'The new User has been created'
            })
        }
    }

    updateUser = async (data, avatar) => {
        let emailExist = await User.findOne({
            where: {
                email: data.email,
            },
            raw: false
        })
        if (!emailExist) {
            let userUpdate = await User.findOne({
                where: {
                    id: data.id,
                },
                raw: false
            })
            if (userUpdate) {
                let passwordHahsed = await hashUserPassword(data.password)
                userUpdate.empCode = data.empCode,
                    userUpdate.email = data.email,
                    userUpdate.password = passwordHahsed,
                    userUpdate.firstname = data.firstname,
                    userUpdate.lastname = data.lastname,
                    userUpdate.age = data.age,
                    userUpdate.phone = data.phone,
                    userUpdate.address = data.address,
                    userUpdate.bhxh = data.bhxh,
                    userUpdate.avatar = avatar,
                    userUpdate.isDeleted = data.isDeleted
                await userUpdate.save();
                return ({
                    errCode: 0,
                    errMsg: 'The user is updated'
                })
            } else {
                return ({
                    errCode: 1,
                    errMsg: 'Not found User!'
                })
            }
        } else {
            return ({
                errCode: -1,
                errMsg: 'The email is already exsit, Please choose another email!'
            })
        }
    }
    softDelete = async (userid) => {
        let user = await User.findOne({
            where: {
                id: userid,
                isDeleted: false
            },
            raw: false
        })
        if (user) {
            user.isDeleted = true;
            await user.save();
            return ({
                errCode: 0,
                errMsg: 'The user is soft deleted',
            })
        } else return ({
            errCode: -1,
            errMsg: 'Not found user!'
        })
    }






}

module.exports = new UserService();