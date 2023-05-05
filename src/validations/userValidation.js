const Joi = require('joi');
const { ROLE_TYPES, REGULAR_EXPRESSIONS } = require("../config/constants")

const userValidation = {
    loginSchema: Joi.object({
        username: Joi.string().required().pattern(REGULAR_EXPRESSIONS.USERNAME),
        password: Joi.string().required().pattern(REGULAR_EXPRESSIONS.PASSWORD),
    }),

    createUserSchema: Joi.object({
        username: Joi.string().required().pattern(REGULAR_EXPRESSIONS.USERNAME),
        password: Joi.string().required().pattern(REGULAR_EXPRESSIONS.PASSWORD),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().required(),
        avatar: Joi.string(),
        email: Joi.string().email().pattern(REGULAR_EXPRESSIONS.EMAIL),
        phone: Joi.string().pattern(REGULAR_EXPRESSIONS.PHONE),
        address: Joi.string(),
        identificationCard: Joi.string().required(),
        role: Joi.string().required().valid(...Object.values(ROLE_TYPES)),
        managerId: Joi.string(),
    }),

    updateUserSchema: Joi.object({
        password: Joi.string().pattern(REGULAR_EXPRESSIONS.PASSWORD),
        firstName: Joi.string(),
        lastName: Joi.string(),
        age: Joi.number(),
        email: Joi.string().email().pattern(REGULAR_EXPRESSIONS.EMAIL),
        phone: Joi.string().pattern(REGULAR_EXPRESSIONS.PHONE),
        address: Joi.string(),
        managerId: Joi.string(),
    })
}

module.exports = userValidation;