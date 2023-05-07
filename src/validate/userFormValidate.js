import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  USERNAME_REGEX,
  NAME_REGEX,
  TIME_REGEX,
  TIME_WITH_SECOND_REGEX,
  PHONE_NUMBER_REGEX,
} from "../utils/regex";
import Joi from "joi";
const editUserFormSchema = Joi.object({
  userComment: Joi.string().min(10).max(50).required(),
  //managerComment: Joi.string().required(),
  createdBy: Joi.string().alphanum().required().pattern(NAME_REGEX),
  //updatedBy: Joi.string().alphanum().required().pattern(NAME_REGEX),
});
const ApproveFormSchema = Joi.object({
  //userComment: Joi.string().min(10).max(50).required(),
  managerComment: Joi.string().required(),
  //createdBy: Joi.string().alphanum().required().pattern(NAME_REGEX),
  //updatedBy: Joi.string().alphanum().required().pattern(NAME_REGEX),
});
const userFormDetail = Joi.object({
  task: Joi.string().min(5).max(50).required(),
  rate: Joi.string().min(1).max(10).required(),
  result: Joi.string().min(5).max(50).required(),
  userFormId: Joi.string().min(5).max(50).required(),
});
export { ApproveFormSchema, editUserFormSchema, userFormDetail };
