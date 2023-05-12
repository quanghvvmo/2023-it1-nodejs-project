const User = require("../database/models/user");
const UserRole = require("../database/models/userRole");
const Rolee = require("../database/models/role");
const httpStatus = require("http-status");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Role = require("../database/models/role");
import APIError from "../utils/errorHandler";
import { response, paginatedResponse, errorResponse } from "../utils/responseHandler";
import { FORM_MESSAGE, USER_STATUS } from "../utils/constant";
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
      message: USER_STATUS.AUTHENTICATION_FAIL,
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
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  return new response(httpStatus.OK, USER_STATUS.AUTHENTICATION, token);
};
const createUser = async (payload, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();

    const [newUser, created] = await User.findOrCreate({
      where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
      defaults: { ...payload, createdBy: currentUser },
      transaction: t,
    });
    const assignRole = await UserRole.create(
      {
        createdBy: currentUser,
        RoleId: payload.RoleId,
        userId: newUser.id,
      },
      { transaction: t }
    );

    if (!created) {
      throw new APIError({
        message: USER_STATUS.USER_EXIST,
        status: httpStatus.CONFLICT,
      });
    }

    const userCreated = await User.findOne({
      where: { username: payload.username },
      include: [
        {
          model: UserRole,
          attributes: ["RoleId"],
          include: [{ model: Role, attributes: ["name"] }],
        },
      ],
    });
    await t.commit();
    return new response(httpStatus.CREATED, USER_STATUS.USER_CREATED, userCreated);
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
    return new errorResponse({
      message: USER_STATUS.USER_NOTFOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
  return new response(httpStatus.OK, USER_STATUS.USER_FOUND, result);
};
const getUsers = async (Page, Size) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { isActive: true },
  });
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / Size);
  if (Page > totalPages) {
    throw new APIError({
      message: FORM_MESSAGE.INVALID_INDEX,
      status: httpStatus.BAD_REQUEST,
    });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;
  if (!users) {
    throw new APIError({
      message: USER_STATUS.USER_NOTFOUND,
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
  let t;
  try {
    t = await sequelize.transaction();
    const user = await User.findOne({
      where: { [Op.and]: [{ id: userId }, { isActive: true }] },
    });
    if (user) {
      user.update(
        payload,
        { where: { [Op.and]: [{ id: userId }, { isActive: true }] } },
        { transaction: t }
      );
      await t.commit();
      return new response(httpStatus.OK, USER_STATUS.USER_UPDATE, user);
    }
    return new errorResponse({
      message: USER_STATUS.USER_NOTFOUND,
      status: httpStatus.NOT_FOUND,
    });
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: USER_STATUS.USER_UPDATE_FAILED,
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
        message: USER_STATUS.USER_NOTFOUND,
        status: httpStatus.NOT_FOUND,
      });
    }
    return new response(httpStatus.OK, USER_STATUS.USER_DELETE, user);
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: USER_STATUS.USER_DELETE_FAILED,
      status: httpStatus.NOT_FOUND,
    });
  }
};
export { login, createUser, getUser, getUsers, disableUser, updateUser };
