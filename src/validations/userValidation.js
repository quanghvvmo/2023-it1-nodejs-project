const Joi = require('joi');
const regularExpressions = require('../_utils/regularExpressions');

const userValidation = {
    loginSchema: Joi.object({
        username: Joi.string().required().pattern(regularExpressions.USERNAME),
        password: Joi.string().required().pattern(regularExpressions.PASSWORD),
    }),

    createUserSchema: Joi.object({
        username: Joi.string().required().pattern(regularExpressions.USERNAME),
        password: Joi.string().required().pattern(regularExpressions.PASSWORD),
        age: Joi.number().required().greater(0),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
    }),

    updateUserSchema: Joi.object({
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        password: Joi.string().pattern(regularExpressions.PASSWORD),
        age: Joi.number().greater(0),
        email: Joi.string().email().pattern(regularExpressions.EMAIL),
        phone: Joi.string().pattern(regularExpressions.PHONE),
        address: Joi.string(),
    })
}

module.exports = userValidation;