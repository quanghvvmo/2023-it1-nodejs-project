const Joi = require('joi');
const regularExpressions = require('../_utils/regularExpressions');
const { roles } = require("../constants/constants")

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
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
        identificationCard: Joi.string(),
        role: Joi.string().required().valid([...Object.keys(roles)]),
    }),

    updateUserSchema: Joi.object({
        password: Joi.string().pattern(regularExpressions.PASSWORD),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
        identificationCard: Joi.string(),
    })
}

module.exports = userValidation;