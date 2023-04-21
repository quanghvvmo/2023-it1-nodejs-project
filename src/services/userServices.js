const User = require("../database/models/user");
const UserRole = require("../database/models/userRole");
const Rolee = require("../database/models/role");
const httpStatus = require("http-status");
const { Op } = require("sequelize");

import Role from "../database/models/role";
import APIError from "../utils/errorHandler";
import { response, paginatedResponse } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

const login = async (payload) => {
  const user = await User.findOne(
    {
      include: [
        {
          model: UserRole,
          include: [
            {
              model: Role,
            },
          ],
        },
      ],
    },

    { where: { username: payload.username } }
  );

  if (!user) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.NOT_FOUND,
    });
  }
  const roleArr = user.userRoles.map((user) => user.Role.id);
  const dataForAccessToken = {
    username: user.username,
    roles: roleArr,
  };
  if (user.password !== payload.password) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.UNAUTHORIZED,
    });
  }
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
const getUsers = async (Page, Size) => {
  const users = await User.findAll({ attributes: { exclude: ["password"] }, where: { isActive: true } });
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / Size);
  if (Page > totalPages) {
    throw new APIError({ message: "Invalid index", status: httpStatus.BAD_REQUEST });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;
  if (!users) {
    throw new APIError({
      message: "Users not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  return new paginatedResponse(Page, Size, totalUsers, totalPages, users.slice(startIndex, endIndex));
};
const updateUser = async (userId, payload) => {
  const user = await User.update(payload, { where: { [Op.and]: [{ id: userId }, { isActive: true }] } });
  if (!user) {
    throw new APIError({
      message: "Users not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  console.log(user);
  return new response(httpStatus.OK, "updated successfully", user);
  const result = User.update(payload, { where: { id: userId } });
  result.then(() => {
    console.log("Record updated successfully");
    return new response(httpStatus.OK, "updated successfully", "ok");
  });
};
const disableUser = async (userID) => {
  const user = await User.update({ isActive: false }, { where: { id: userID } });
  if (!user) {
    throw new APIError({
      message: "User not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  return new response(httpStatus.OK, "deleted successful", user);
};
export { login, createUser, getUser, getUsers, disableUser, updateUser };
