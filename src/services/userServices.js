const User = require("../database/models/user");
const UserRole = require("../database/models/userRole");
const Rolee = require("../database/models/role");
//import { sequelize } from "squelize";
const httpStatus = require("http-status");
import Role from "../database/models/role";
import APIError from "../utils/errorHandler";
import response from "../utils/responseHandler";
//import generateToken from "./tokenService";
import jwt from "jsonwebtoken";

//const t = await sequelize.transaction();
const login = async (payload) => {
  const user = await User.findOne({ where: { username: payload.username } });
  if (!user) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.NOT_FOUND,
    });
  }
  const dataForAccessToken = {
    username: user.username,
  };
  if (user.password !== payload.password) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.UNAUTHORIZED,
    });
  }
  //const token = generateToken(dataForAccessToken);
  const token = jwt.sign(dataForAccessToken, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return new response(httpStatus.OK, "Login successful", token);
};
const createUser = async (payload) => {
  const { username, password, firstName, lastName, email, phone, avatar, managerId, address, createdBy, createdAt, updatedBy, updatedAt, isActive } = payload;
  const [newUser, created] = await User.findOrCreate({
    where: { username: payload.username },
    defaults: {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      avatar,
      managerId,
      address,
      isActive,
      createdBy,
      createdAt,
      updatedBy,
      updatedAt,
    },
  });

  if (!created) {
    throw new APIError({
      message: "User already exists",
      status: httpStatus.CONFLICT,
    });
  }
  return new response(httpStatus.OK, "created successful", newUser);
};
const getUser = async (userID) => {
  const result = await User.findByPk(userID, { include: [{ model: UserRole, include: [{ model: Rolee }] }] });
  if (!result) {
    throw new APIError({
      message: "User not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  return new response(httpStatus.OK, "User found", result);
};
export { login, createUser, getUser };
