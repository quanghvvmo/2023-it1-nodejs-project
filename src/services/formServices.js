import APIError from "../utils/errorHandler";
import { response, paginatedResponse } from "../utils/responseHandler";
import { userFormStatus } from "../utils/formConstant";
import { Op } from "sequelize";
import sendEmail from "./mailServices";
const User = require("../database/models/user");
const httpStatus = require("http-status");

const Form = require("../database/models/form");
const createForm = async (payload) => {
  const [newForm, created] = await Form.findOrCreate({
    where: { [Op.or]: [{ name: payload.name }, { dueDate: payload.dueDate }] },
    defaults: { ...payload },
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

  console.log(listmail);
  sendEmail(listmail.join(", "));
  return new response(httpStatus.OK, "created successful", newForm);
};

export { createForm };
