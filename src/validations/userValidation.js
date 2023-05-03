const Joi = require('joi');
const regularExpressions = require('../_utils/regularExpressions');
const { ROLE_TYPES } = require("../config/constants")

const userValidation = {
    loginSchema: Joi.object({
        username: Joi.string().required().pattern(regularExpressions.USERNAME),
        password: Joi.string().required().pattern(regularExpressions.PASSWORD),
    }),

    createUserSchema: Joi.object({
        username: Joi.string().required().pattern(regularExpressions.USERNAME),
        password: Joi.string().required().pattern(regularExpressions.PASSWORD),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.number().required(),
        avatar: Joi.string(),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
        identificationCard: Joi.string().required(),
        role: Joi.string().required().valid(...Object.values(ROLE_TYPES)),
        ManagerId: Joi.string(),
    }),

    updateUserSchema: Joi.object({
        password: Joi.string().pattern(regularExpressions.PASSWORD),
        firstName: Joi.string(),
        lastName: Joi.string(),
        age: Joi.number(),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
        ManagerId: Joi.string(),
    })
}

module.exports = userValidation;