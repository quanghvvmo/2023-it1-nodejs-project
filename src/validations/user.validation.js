import Joi from "joi";
import {
    USERNAME_REGEX,
    EMAIL_REGEX,
    PHONE_NUMBER_REGEX,
    PASSWORD_REGEX,
} from "../_utils/regex_validation.js";

const createUserSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().pattern(EMAIL_REGEX),
    phone: Joi.string().pattern(PHONE_NUMBER_REGEX),
    address: Joi.string(),
    CMND: Joi.string(),
});

const updateUserSchema = Joi.object({
    password: Joi.string().pattern(PASSWORD_REGEX),
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email().pattern(EMAIL_REGEX),
    phone: Joi.string().pattern(PHONE_NUMBER_REGEX),
    address: Joi.string(),
    CMND: Joi.string(),
});

const loginSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    password: Joi.string().required().pattern(PASSWORD_REGEX),
});

export { createUserSchema, updateUserSchema, loginSchema };
