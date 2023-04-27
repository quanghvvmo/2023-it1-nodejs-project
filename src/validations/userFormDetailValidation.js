const Joi = require('joi');

const userformDetailValidation = {
    createUserFormDetailSchema: Joi.object({
        description: Joi.string(),
        rating: Joi.string()
    }),
    updateUserFormDetailSchema: Joi.object({
        description: Joi.string(),
        rating: Joi.string()
    })
}

module.exports = userformDetailValidation;