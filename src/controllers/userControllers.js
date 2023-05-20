import {
  login,
  createUser,
  getUser,
  getUsers,
  disableUser,
  updateUser,
  getCurrentUser,
} from "../services/userServices";
import httpStatus from "http-status";
import { Loginschema, UserSchema, UserUpdateSchema } from "../validate/userValidate";
const User = require("../database/models/user");
let status;
const loginController = async (req, res, next) => {
  try {
    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const token = await login(value);
    return res.status(httpStatus.OK).json({ token });
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req, res, next) => {
  try {
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const currentUser = req.user.username;
    const user = await createUser(value, currentUser);
    status = user.status.status;
    res.status(status || httpStatus.CREATED).json(user);
    console.log("a");
  } catch (err) {
    next(err);
  }
};
const getUserByID = async (req, res, next) => {
  try {
    const userID = req.user.userId;
    console.log(req.user.userId);
    const id = req.params.id || 0;
    const user = await getUser(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
const getListUser = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const users = await getUsers(page, size);
    res.status(httpStatus.OK).json(users);
  } catch (err) {
    next(err);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const deleted = await disableUser(userID);
    res.status(httpStatus.OK).json(deleted);
  } catch (err) {
    next(err);
  }
};
const editUser = async (req, res, next) => {
  try {
    const { error, value } = UserUpdateSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const userID = req.params.id;
    const user = await updateUser(userID, value);
    res.status(httpStatus.OK).json(user);
  } catch (err) {
    next(err);
  }
};
const getCurrentUserDetails = async (req, res, next) => {
  try {
    const userID = req.user.userId;
    const user = await getCurrentUser(userID);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
export {
  loginController,
  createUserController,
  getUserByID,
  getListUser,
  deleteUser,
  editUser,
  getCurrentUserDetails,
};
