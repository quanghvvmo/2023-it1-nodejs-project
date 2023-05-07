import APIError from "../utils/errorHandler";
import { response, paginatedResponse } from "../utils/responseHandler";
import { FORM_STATUS, USER_FORM_STATUS, FORM_MESSAGE } from "../utils/constant";

const { sequelize } = require("../config/database");
import sendEmail from "./mailServices";
const User = require("../database/models/user");
const Form = require("../database/models/form");
const UserForm = require("../database/models/userform");
const FormCategory = require("../database/models/formCate");
const httpStatus = require("http-status");

const createForm = async (payload, currentUser, currentUserId) => {
  let t;
  console.log(currentUserId);
  console.log(payload.formCategoryId);
  try {
    t = await sequelize.transaction();
    const formsInvalid = await UserForm.findAll({
      where: {
        userId: currentUserId,
        status: [USER_FORM_STATUS.NEW, USER_FORM_STATUS.SUBMITTED],
      },
      include: [
        {
          model: Form,
          include: { model: FormCategory, where: { id: payload.formCategoryId } },
        },
      ],
    });
    if (formsInvalid.length) {
      return new response({
        message: FORM_MESSAGE.SINGLE_OPEN_FORM_LIMITATION,
        status: httpStatus.BAD_REQUEST,
      });
    }
    const [newForm, created] = await Form.findOrCreate({
      where: { name: payload.name },
      defaults: {
        ...payload,
        status: FORM_STATUS.OPEN,
        createdBy: currentUser,
        updatedBy: currentUser,
      },
      transaction: t,
    });
    await t.commit();
    if (!created) {
      throw new APIError({
        message: FORM_MESSAGE.EXIST,
        status: httpStatus.CONFLICT,
      });
    }
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
        createdBy: currentUser,
        updatedBy: currentUser,
        status: USER_FORM_STATUS.NEW,
      };
    });
    await UserForm.bulkCreate(userFoms);
    console.log(currentUser);

    return new response(httpStatus.OK, "created successful", newForm);
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: "error creating",
      status: httpStatus.CONFLICT,
    });
  }
};
const getListForm = async (Page, Size) => {
  const forms = await Form.findAll({ where: { status: "OPEN" } });
  const totalForms = forms.length;
  const totalPages = Math.ceil(totalForms / Size);
  if (Page > totalPages) {
    throw new APIError({
      message: "Invalid index",
      status: httpStatus.BAD_REQUEST,
    });
  }
  const startIndex = (Page - 1) * Size;
  const endIndex = startIndex + Size;
  if (!forms) {
    throw new APIError({
      message: "Forms not found",
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
  try {
    const t = await sequelize.transaction();
    const form = await Form.update(
      { status: "CLOSE" },
      { where: { id: formID } },
      { transaction: t }
    );
    if (form == 0) {
      throw new APIError({
        message: "Form close failed",
        status: httpStatus.NOT_MODIFIED,
      });
    }
    t.commit();
    return new response(httpStatus.OK, "updated successfully", form);
  } catch (err) {
    await t.rollback();
  }
};

export { createForm, updateForm, closeForm, getListForm };
