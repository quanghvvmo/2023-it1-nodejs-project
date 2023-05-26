import APIError from "../utils/errorHandler";
import { errorResponse, response, paginatedResponse } from "../utils/responseHandler";
import {
  FORM_CATEGORIES,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
} from "../utils/constant";
const httpStatus = require("http-status");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

const UserForm = require("../database/models/userform");
const Form = require("../database/models/form");
const UserRole = require("../database/models/userRole");
const User = require("../database/models/user");
const formDetail = require("../database/models/formDetail");
const Role = require("../database/models/role");
const getUserForms = async (uId, Page, Size) => {
  try {
    const userForms = await UserForm.findAll(
      { where: { userId: uId } },
      { include: [{ model: Form }] }
    );
    const totalForms = userForms.length;
    const totalPages = Math.ceil(totalForms / Size);
    if (Page > totalPages) {
      throw new APIError({
        message: FORM_MESSAGE.INVALID_INDEX,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const startIndex = (Page - 1) * Size;
    const endIndex = startIndex + Size;
    if (!userForms) {
      throw new APIError({
        message: FORM_MESSAGE.NOT_FOUND,
        status: httpStatus.NOT_FOUND,
      });
    }
    return new paginatedResponse(
      Page,
      Size,
      totalForms,
      totalPages,
      userForms.slice(startIndex, endIndex)
    );
  } catch (err) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getUserFormsOrderByDateASC = async (uId, Page, Size) => {
  try {
    const userForms = await UserForm.findAll({
      where: { userId: uId },
      include: [{ model: Form }],
      order: [["updatedAt", "ASC"]],
    });
    const totalForms = userForms.length;
    const totalPages = Math.ceil(totalForms / Size);
    if (Page > totalPages) {
      throw new APIError({
        message: FORM_MESSAGE.INVALID_INDEX,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const startIndex = (Page - 1) * Size;
    const endIndex = startIndex + Size;
    if (!userForms) {
      throw new APIError({
        message: FORM_MESSAGE.NOT_FOUND,
        status: httpStatus.NOT_FOUND,
      });
    }
    return new paginatedResponse(
      Page,
      Size,
      totalForms,
      totalPages,
      userForms.slice(startIndex, endIndex)
    );
  } catch (err) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getUserFormsOrderByDateDESC = async (uId, Page, Size) => {
  try {
    const userForms = await UserForm.findAll({
      where: { userId: uId },
      include: [{ model: Form }],
      order: [["updatedAt", "DESC"]],
    });
    const totalForms = userForms.length;
    const totalPages = Math.ceil(totalForms / Size);
    if (Page > totalPages) {
      throw new APIError({
        message: FORM_MESSAGE.INVALID_INDEX,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const startIndex = (Page - 1) * Size;
    const endIndex = startIndex + Size;
    if (!userForms) {
      throw new APIError({
        message: FORM_MESSAGE.NOT_FOUND,
        status: httpStatus.NOT_FOUND,
      });
    }
    return new paginatedResponse(
      Page,
      Size,
      totalForms,
      totalPages,
      userForms.slice(startIndex, endIndex)
    );
  } catch (err) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const createFormDetail = async (payload, currentUser) => {
  let t;
  try {
    t = await sequelize.transaction();
    const existUserForm = await UserForm.findOne({ where: { id: payload.userformId } });
    if (existUserForm.userId == currentUser.userId) {
      const result = await formDetail.create(
        { ...payload, createdBy: currentUser.username },
        { transaction: t }
      );
      t.commit();
      return new response(httpStatus.OK, USER_FORM_STATUS.USER_FORM_UPDATE, result);
    } else {
      return new errorResponse(
        httpStatus.NOT_FOUND,
        USER_FORM_STATUS.USER_FORM_UPDATE_FAILED
      );
    }
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.BAD_REQUEST,
    });
  }
};
const updateFormDetail = async (payload, userId, FormDetailId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const [affectedRows, affectedRowsData] = await formDetail.update(
      { ...payload },
      { where: { id: FormDetailId } }
    );
    t.commit();
    console.log(affectedRows);
    console.log(FormDetailId);
    if (affectedRows > 0) {
      return new response(
        httpStatus.OK,
        USER_FORM_STATUS.USER_FORM_UPDATE,
        affectedRowsData
      );
    }
    return new errorResponse({
      status: httpStatus.NOT_MODIFIED,
      message: USER_FORM_STATUS.UPDATE_OTHER_FORM_ERROR,
    });
  } catch (err) {
    await t.rollback();
    return new errorResponse({
      status: httpStatus.NOT_MODIFIED,
      message: FORM_MESSAGE.ROLLBACK_FAILED,
    });
  }
};
const updateUserForm = async (payload, formId, uId, currentUser) => {
  let t;

  try {
    t = await sequelize.transaction();
    const userForm = await UserForm.findOne(
      { where: { id: formId }, include: [{ model: Form }] }
      // { include: [{ model: Form }] }
    );

    const date = new Date();
    const currentDate = date.toISOString().slice(0, 19).replace("T", " ");
    const deadline = userForm.form.dueDate.toISOString().slice(0, 19).replace("T", " ");
    const now = new Date(currentDate);
    const dueDate = new Date(deadline);
    if (now <= dueDate) {
      if (userForm.userId == uId) {
        userForm.update(
          { ...payload, updatedBy: currentUser, status: USER_FORM_STATUS.SUBMITTED },
          {
            where: { [Op.and]: [{ id: formId }, { userId: uId }] },
          },
          { transaction: t }
        );
        t.commit();
        return new response(httpStatus.OK, USER_FORM_STATUS.USER_FORM_UPDATE, userForm);
      } else {
        return new errorResponse(
          httpStatus.BAD_REQUEST,
          USER_FORM_STATUS.UPDATE_OTHER_FORM_ERROR
        );
      }
    } else {
      return new errorResponse(httpStatus.BAD_REQUEST, USER_FORM_STATUS.OVER_DUEDATE);
    }
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_MODIFIED,
    });
  }
};
const approveForm = async (payload, currentUser, formId, roleId) => {
  let t;
  console.log(formId);
  try {
    let formStatus;
    t = await sequelize.transaction();
    const userForm = await UserForm.findOne({
      where: { id: formId },
      include: [{ model: Form }],
    });
    const role = await Role.findOne({ where: { id: roleId } });
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 19).replace("T", " ");
    const deadline = userForm.form.dueDate.toISOString().slice(0, 19).replace("T", " ");
    const now = new Date(currentDate);
    const dueDate = new Date(deadline);
    if (now <= dueDate) {
      if (userForm.status == USER_FORM_STATUS.SUBMITTED) {
        formStatus = USER_FORM_STATUS.APPROVED;
        userForm.update(
          {
            ...payload,
            updatedBy: currentUser.username,
            managerId: currentUser.userId,
            status: formStatus,
          },
          {
            where: { id: formId },
          },
          { transaction: t }
        );
        t.commit();
        return new response(httpStatus.OK, USER_FORM_STATUS.USER_FORM_UPDATE, userForm);
      } else {
        console.log(userForm.status);
        return new errorResponse(
          httpStatus.BAD_REQUEST,
          USER_FORM_STATUS.APPROVED_FAILED
        );
      }
    } else {
      return new errorResponse(httpStatus.BAD_REQUEST, USER_FORM_STATUS.OVER_DUEDATE);
    }
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: FORM_MESSAGE.ROLLBACK_FAILED,
      status: httpStatus.NOT_MODIFIED,
    });
  }
};
const getAllForms = async (currentUser, Page, Size) => {
  try {
    const userForms = await UserForm.findAll({ include: [{ model: formDetail }] });
    const totalForms = userForms.length;
    const totalPages = Math.ceil(totalForms / Size);
    if (Page > totalPages) {
      throw new APIError({
        message: FORM_MESSAGE.INVALID_INDEX,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const startIndex = (Page - 1) * Size;
    const endIndex = startIndex + Size;
    if (!userForms) {
      return new errorResponse({
        message: FORM_MESSAGE.NOT_FOUND,
        status: httpStatus.NOT_FOUND,
      });
    }
    return new paginatedResponse(
      Page,
      Size,
      totalForms,
      totalPages,
      userForms.slice(startIndex, endIndex)
    );
  } catch (err) {
    return new errorResponse({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
};
const getFormsByStatus = async (status, Page, Size) => {
  const { count, rows } = await UserForm.findAndCountAll({
    include: [{ model: User }, { model: Form }],
    where: { status: status },
  });
  if (count <= 0) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_FOUND,
    });
  }
  const totalForms = rows.length;
  const totalPages = Math.ceil(totalForms / Size);
  if (Page > totalPages) {
    throw new APIError({
      message: FORM_MESSAGE.INVALID_INDEX,
      status: httpStatus.BAD_REQUEST,
    });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;

  return new paginatedResponse(
    Page,
    Size,
    totalForms,
    totalPages,
    rows.slice(startIndex, endIndex)
  );
};
const getUsersIncompletedForm = async () => {
  try {
    const result = await User.findAll({
      include: [{ model: UserForm, attributes: ["id"], where: { userComment: null } }],
      attributes: ["id", "username", "email"],
    });
    return new response(httpStatus.OK, FORM_MESSAGE.FOUND, result);
  } catch (err) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_MODIFIED,
    });
  }
};
const getUsersCompletedForm = async () => {
  try {
    const result = await User.findAll({
      include: [
        {
          model: UserForm,
          attributes: ["id"],
          where: { userComment: { [Op.not]: null } },
        },
      ],
      attributes: ["id", "username", "email"],
    });
    return new response(httpStatus.OK, FORM_MESSAGE.FOUND, result);
  } catch (err) {
    throw new APIError({
      message: FORM_MESSAGE.NOT_FOUND,
      status: httpStatus.NOT_MODIFIED,
    });
  }
};

export {
  getUserForms,
  updateUserForm,
  approveForm,
  getUsersIncompletedForm,
  getAllForms,
  createFormDetail,
  getUsersCompletedForm,
  updateFormDetail,
  getFormsByStatus,
  getUserFormsOrderByDateASC,
  getUserFormsOrderByDateDESC,
};
