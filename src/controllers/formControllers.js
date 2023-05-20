import httpStatus from "http-status";
import {
  createForm,
  updateForm,
  closeForm,
  getListForm,
  getFormsByStatus,
} from "../services/formServices";
import { createFormSchema, editFormSchema } from "../validate/formValidate";
const createNewForm = async (req, res, next) => {
  try {
    const { error, value } = createFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const currentUser = req.user.username;
    const currentUserId = req.user.userId;
    const form = await createForm(value, currentUser, currentUserId);
    const status = form.status.status;
    res.status(status || httpStatus.CREATED).json(form);
  } catch (err) {
    next(err);
  }
};
const getForms = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const users = await getListForm(page, size);
    res.status(httpStatus.FOUND).json(users);
  } catch (err) {
    next(err);
  }
};
const editForm = async (req, res, next) => {
  try {
    const { error, value } = editFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const formId = req.params.id;
    const form = await updateForm(value, formId);
    res.status(httpStatus.OK).json(form);
  } catch (err) {
    next(err);
  }
};
const getAllFormsByStatus = async (req, res, next) => {
  try {
    const { status, page, size } = req.query;
    const forms = await getFormsByStatus(status, page, size);
    res.status(httpStatus.OK).json(forms);
  } catch (err) {
    next(err);
  }
};
const close = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await closeForm(id);
    res.status(httpStatus.OK).json(form);
  } catch (err) {
    next(err);
  }
};
export { createNewForm, editForm, close, getForms, getAllFormsByStatus };
