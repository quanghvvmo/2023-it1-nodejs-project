import {
  getUserForms,
  updateUserForm,
  approveForm,
  getAllForms,
  getUsersIncompletedForm,
  createFormDetail,
  updateFormDetail,
  getUsersCompletedForm,
} from "../services/userFormServices";
import httpStatus from "http-status";
import {
  editUserFormSchema,
  ApproveFormSchema,
  userFormDetail,
  userFormDetailUpdate,
} from "../validate/userFormValidate";
const GetListUserForm = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const uId = req.user.userId;
    const userForms = await getUserForms(uId, page, size);
    res.status(httpStatus.FOUND).json(userForms);
  } catch (err) {
    next(err);
  }
};
const getListForm = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const currentUser = req.user.userId;
    console.log(currentUser);
    const userForms = await getAllForms(currentUser, page, size);
    res.status(httpStatus.FOUND).json(userForms);
  } catch (err) {
    next(err);
  }
};
const createFormDetails = async (req, res, next) => {
  try {
    const { error, value } = userFormDetail.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const currentUser = req.user.id;
    const result = await createFormDetail(value, currentUser);
    res.status(httpStatus.CREATED).json(result);
  } catch (err) {
    next(err);
  }
};
const EditUserFormDetail = async (req, res, next) => {
  try {
    const { error, value } = userFormDetailUpdate.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const currentUser = req.user.id;
    const FormDetailId = req.params.id;
    const result = await updateFormDetail(value, currentUser, FormDetailId);
    console.log(FormDetailId);
    res.status(result.status.status || httpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
const EditUserForm = async (req, res, next) => {
  try {
    const { error, value } = editUserFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const id = req.params.id;
    const userId = req.user.userId;
    const currentUser = req.user.username;
    const result = await updateUserForm(value, id, userId, currentUser);
    res.status(result.status || httpStatus.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
const approvedForm = async (req, res, next) => {
  try {
    const { error, value } = ApproveFormSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const formId = req.params.id;
    const currentUser = req.user.username;
    const role = req.user.roles;
    const result = await approveForm(value, currentUser, formId, role);
    res.status(httpStatus.CREATED).json(result);
  } catch (err) {
    next(err);
  }
};
const getListIncompletedForm = async (req, res, next) => {
  try {
    const result = await getUsersIncompletedForm();
    res.status(httpStatus.OK).json(result);
  } catch (err) {
    next(err);
  }
};
const getListCompletedForm = async (req, res, next) => {
  try {
    const result = await getUsersCompletedForm();
    res.status(httpStatus.OK).json(result);
  } catch (err) {
    next(err);
  }
};
export {
  GetListUserForm,
  EditUserForm,
  approvedForm,
  getListIncompletedForm,
  getListForm,
  createFormDetails,
  EditUserFormDetail,
  getListCompletedForm,
};
