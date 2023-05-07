const User = require("../database/models/user");
const UserRole = require("../database/models/userRole");
const Rolee = require("../database/models/role");
const httpStatus = require("http-status");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Role = require("../database/models/role");
import APIError from "../utils/errorHandler";
import {
  createUserResponse,
  response,
  paginatedResponse,
} from "../utils/responseHandler";
import jwt from "jsonwebtoken";

const login = async (payload) => {
  const user = await User.findOne({
    where: {
      [Op.and]: [{ username: payload.username }, { password: payload.password }],
    },
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
  });
  if (!user) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.NOT_FOUND,
    });
  }
  const roleArr = user.userRoles.map((user) => user.Role.id);
  const dataForAccessToken = {
    userId: user.id,
    username: user.username,
    roles: roleArr,
  };
  const token = jwt.sign(dataForAccessToken, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return new response(httpStatus.OK, "Login successful", token);
};
const createUser = async (payload) => {
  let t;
  try {
    t = await sequelize.transaction();
    const [newUser, created] = await User.findOrCreate(
      {
        where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
        defaults: { ...payload },
        transaction: t,
      }
      //{ transaction: t }
    );
    const assignRole = await UserRole.create(
      {
        createdBy: "ADMIN",
        RoleId: payload.RoleId,
        userId: newUser.id,
      },
      { transaction: t }
    );
    if (!created) {
      throw new APIError({
        message: "User already exists",
        status: httpStatus.CONFLICT,
      });
    }
    await t.commit();
    return new createUserResponse(
      httpStatus.OK,
      "created successful",
      newUser,
      assignRole
    );
  } catch (err) {
    console.error(err);
    await t.rollback();
    throw new APIError({
      message: err,
      status: httpStatus.CONFLICT,
    });
  }
};
const getUser = async (userID) => {
  const result = await User.findByPk(userID, {
    include: [{ model: UserRole, include: [{ model: Rolee }] }],
  });
  if (!result) {
    throw new APIError({
      message: "User not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  return new response(httpStatus.OK, "User found", result);
};
const getUsers = async (Page, Size) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { isActive: true },
  });
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
  return new paginatedResponse(
    Page,
    Size,
    totalUsers,
    totalPages,
    users.slice(startIndex, endIndex)
  );
};
const updateUser = async (userId, payload) => {
  try {
    const t = await sequelize.transaction();
    const user = await User.update(
      payload,
      { where: { [Op.and]: [{ id: userId }, { isActive: true }] } },
      { transaction: t }
    );
    await t.commit();
    if (user == 0) {
      throw new APIError({
        message: "Users not found",
        status: httpStatus.NOT_FOUND,
      });
    }
    return new response(httpStatus.OK, "updated successfully", user);
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: "Update failed",
      status: httpStatus.NOT_FOUND,
    });
  }
};
const disableUser = async (userID) => {
  try {
    const t = await sequelize.transaction();
    const user = await User.update(
      { isActive: false },
      { where: { id: userID } },
      { transaction: t }
    );
    await t.commit();
    if (!user) {
      throw new APIError({
        message: "User not found",
        status: httpStatus.NOT_FOUND,
      });
    }
    return new response(httpStatus.OK, "deleted successful", user);
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: "Delete failed",
      status: httpStatus.NOT_FOUND,
    });
  }
};
export { login, createUser, getUser, getUsers, disableUser, updateUser };
