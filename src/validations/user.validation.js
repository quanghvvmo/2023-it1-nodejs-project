import Joi from "joi";
import { USERNAME_REGEX, EMAIL_REGEX } from "../_utils/regex_validation.js";

const createUserSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    email: Joi.string().email().pattern(EMAIL_REGEX),
    password: Joi.string().required(),
    age: Joi.number().required().greater(0),
    phone: Joi.string(),
    address: Joi.string(),
});

const updateUserSchema = Joi.object({
    email: Joi.string().email().pattern(EMAIL_REGEX),
    password: Joi.string(),
    age: Joi.number().greater(0),
    phone: Joi.string(),
    address: Joi.string(),
});

const loginSchema = Joi.object({
    username: Joi.string().required().pattern(USERNAME_REGEX),
    password: Joi.string().required(),
});

export { createUserSchema, updateUserSchema,loginSchema };
