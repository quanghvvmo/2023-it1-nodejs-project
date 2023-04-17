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
const Loginschema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .pattern(USERNAME_REGEX),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
const UserSchema = Joi.object({
  username: Joi.string()
    //.alphanum()
    .min(3)
    .max(30)
    .required()
    .pattern(USERNAME_REGEX),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  createdBy: Joi.string().min(3).max(30).required(),
  updatedBy: Joi.string().min(3).max(30).required(),
});
export { Loginschema, UserSchema };
