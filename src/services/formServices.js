import APIError from "../utils/errorHandler";
import { response, paginatedResponse, errorResponse } from "../utils/responseHandler";
import {
  FORM_CATEGORY,
  FORM_STATUS,
  USER_FORM_STATUS,
  FORM_MESSAGE,
} from "../utils/constant";

const { sequelize } = require("../config/database");
import sendEmail from "./mailServices";
import { Sequelize } from "sequelize";
const User = require("../database/models/user");
const Form = require("../database/models/form");
const UserForm = require("../database/models/userform");
const FormCategory = require("../database/models/formCate");
const httpStatus = require("http-status");

const createForm = async (payload, currentUser, currentUserId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const cateId = payload.formCategoryId;
    const formsInvalid = await UserForm.findAll({
      where: {
        status: [USER_FORM_STATUS.NEW, USER_FORM_STATUS.SUBMITTED],
      },
      include: [
        {
          model: Form,
          where: { formCategoryId: FORM_CATEGORY[cateId] },
          include: { model: FormCategory },
        },
      ],
    });

    if (formsInvalid.length) {
      return new errorResponse({
        message: FORM_MESSAGE.SINGLE_OPEN_FORM_LIMITATION,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const [newForm, created] = await Form.findOrCreate({
      where: { name: payload.name },
      defaults: {
        ...payload,
        status: FORM_STATUS.OPEN,
        formCategoryId: FORM_CATEGORY[payload.formCategoryId],
        createdBy: currentUser,
        updatedBy: currentUser,
      },
      transaction: t,
    });
    if (created) {
      const mails = await User.findAll({ attributes: ["email"] });
      const listmail = [];
      for (let i = 0; i < mails.length; i++) {
        listmail.push(mails[i].dataValues.email);
      }
      sendEmail(listmail.join(", "));
      const user = await User.findAll();

      const userFoms = user.map((user) => {
        return {
          userId: user.dataValues.id,
          formId: newForm.id,
          managerId: user.dataValues.managerId,
          createdBy: currentUser,
          updatedBy: currentUser,
          status: USER_FORM_STATUS.NEW,
        };
      });
      console.log(userFoms);
      await UserForm.bulkCreate(userFoms, { transaction: t });
      await t.commit();
      return new response(httpStatus.CREATED, FORM_MESSAGE.CREATED, newForm);
    }
    return new errorResponse({
      message: FORM_MESSAGE.EXIST,
      status: httpStatus.BAD_REQUEST,
    });
  } catch (err) {
    if (t) {
      await t.rollback();
      throw new APIError({
        message: FORM_MESSAGE.FORM_CREATED_FAIL,
        status: httpStatus.CONFLICT,
      });
    }
  }
};
const getListForm = async (Page, Size) => {
  const forms = await Form.findAll({
    where: { status: FORM_STATUS.OPEN },
    include: [{ model: FormCategory }],
  });
  const totalForms = forms.length;
  const totalPages = Math.ceil(totalForms / Size);
  if (Page > totalPages) {
    throw new APIError({
      message: FORM_MESSAGE.INVALID_INDEX,
      status: httpStatus.BAD_REQUEST,
    });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;
  if (!forms) {
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
    forms.slice(startIndex, endIndex)
  );
};
const getFormsByStatus = async (status, Page, Size) => {
  const { count, rows } = await Form.findAndCountAll({ where: { status: status } });
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
const updateForm = async (payload, formID) => {
  let t;

  t = await sequelize.transaction();
  const form = await Form.findOne({ where: { id: formID } });
  if (form) {
    await form.update(payload, { where: { id: formID } }, { transaction: t });
    return new response(httpStatus.OK, FORM_MESSAGE.FORM_UPDATED, form);
  }
  throw new APIError({
    message: FORM_MESSAGE.NOT_FOUND,
    status: httpStatus.NOT_MODIFIED,
  });
};
const closeForm = async (formID) => {
  try {
    const t = await sequelize.transaction();
    const form = await Form.findOne({ where: { id: formID } });
    if (form) {
      await form.update(
        { status: FORM_STATUS.CLOSE },
        { where: { id: formID } },
        { transaction: t }
      );
      t.commit();
      return new response(httpStatus.OK, FORM_MESSAGE.FORM_CLOSED, form);
    }

    throw new APIError({
      message: FORM_MESSAGE.FORM_CLOSED_FAIL,
      status: httpStatus.NOT_MODIFIED,
    });
  } catch (err) {
    await t.rollback();
  }
};

export { createForm, updateForm, closeForm, getListForm, getFormsByStatus };
