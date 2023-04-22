import httpStatus from "http-status";
import { createForm, updateForm, closeForm, getListForm } from "../services/formServices";
import { createFormSchema, editFormSchema } from "../validate/formValidate";
const createNewForm = async (req, res, next) => {
  try {
    const { error, value } = createFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const form = await createForm(value);
    res.status(httpStatus.CREATED).json(form);
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
const close = async (req, res, next) => {
  try {
    const form = await closeForm(req.params.id);
    res.status(httpStatus.OK).json(form);
  } catch (err) {
    next(err);
  }
};
export { createNewForm, editForm, close, getForms };
