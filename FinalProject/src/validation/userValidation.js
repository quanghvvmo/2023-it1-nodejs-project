import Joi from "joi";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from "../_ultis/index";

const userValidation = {
    validateUser: Joi.object({
        empCode: Joi.string().required(),
        email: Joi.string().email().pattern(EMAIL_REGEX),
        password: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        age: Joi.number().required().greater(0),
        phone: Joi.string().pattern(PHONE_NUMBER_REGEX),
        address: Joi.string(),
        bhxh: Joi.string(),
        isDeleted: Joi.boolean.required()
    }),

    login: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}


module.exports = userValidation;