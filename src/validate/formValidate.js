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
const createFormSchema = Joi.object({
  name: Joi.string().min(10).max(50).required().pattern(NAME_REGEX),
  dueDate: Joi.string().required(),
  description: Joi.string(),
  formCategoryId: Joi.number().required(),
});
const editFormSchema = Joi.object({
  name: Joi.string().min(10).max(50).pattern(NAME_REGEX),
  dueDate: Joi.string().required(),
  description: Joi.string(),
  formCategoryId: Joi.number(),
});
export { createFormSchema, editFormSchema };
