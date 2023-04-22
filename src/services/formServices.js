import APIError from "../utils/errorHandler";
import { response, paginatedResponse } from "../utils/responseHandler";
import { userFormStatus } from "../utils/formConstant";
import { Op } from "sequelize";
const { sequelize } = require("../config/database");
import sendEmail from "./mailServices";
const User = require("../database/models/user");
const httpStatus = require("http-status");

const Form = require("../database/models/form");
const createForm = async (payload) => {
  const t = await sequelize.transaction();
  try {
    const [newForm, created] = await Form.findOrCreate({
      where: { name: payload.name },
      defaults: { ...payload },
      transaction: t,
    });
    if (!created) {
      throw new APIError({
        message: "form already exists",
        status: httpStatus.CONFLICT,
      });
    }

    const mails = await User.findAll({ attributes: ["email"] });
    const listmail = [];
    for (let i = 0; i < mails.length; i++) {
      listmail.push(mails[i].dataValues.email);
    }

    sendEmail(listmail.join(", "));
    await t.commit();
    return new response(httpStatus.OK, "created successful", newForm);
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: "form already exists",
      status: httpStatus.CONFLICT,
    });
  }
};
const getListForm = async (Page, Size) => {
  const forms = await Form.findAll({ where: { status: "OPEN" } });
  const totalForms = forms.length;
  const totalPages = Math.ceil(totalForms / Size);
  if (Page > totalPages) {
    throw new APIError({ message: "Invalid index", status: httpStatus.BAD_REQUEST });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;
  if (!forms) {
    throw new APIError({
      message: "Forms not found",
      status: httpStatus.NOT_FOUND,
    });
  }
  return new paginatedResponse(Page, Size, totalForms, totalPages, forms.slice(startIndex, endIndex));
};
const updateForm = async (payload, formID) => {
  const form = await Form.update(payload, { where: { id: formID } });
  if (form == 0) {
    throw new APIError({
      message: "Form update failed",
      status: httpStatus.NOT_MODIFIED,
    });
  }
  return new response(httpStatus.OK, "updated successfully", form);
};
const closeForm = async (formID) => {
  const t = await sequelize.transaction();
  try {
    const form = await Form.update({ status: "CLOSE" }, { where: { id: formID } }, { transaction: t });
    t.commit();
    if (form == 0) {
      throw new APIError({
        message: "Form close failed",
        status: httpStatus.NOT_MODIFIED,
      });
    }
    return new response(httpStatus.OK, "updated successfully", form);
  } catch (err) {
    await t.rollback();
  }
};

export { createForm, updateForm, closeForm, getListForm };
