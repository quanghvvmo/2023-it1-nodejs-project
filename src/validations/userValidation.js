const Joi = require('joi');
const regularExpressions = require('../_utils/regularExpressions');
const roleTypes = require("../constants/types/role")

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
        employeeCode: Joi.string().required(),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
        identificationCard: Joi.string().required(),
        role: Joi.string().required().valid(Object.keys(roleTypes)),
    }),

    updateUserSchema: Joi.object({
        password: Joi.string().pattern(regularExpressions.PASSWORD),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
    })
}

module.exports = userValidation;