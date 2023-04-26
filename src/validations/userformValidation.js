const Joi = require('joi');

const userformValidation = {
    createUserFormSchema: Joi.object({
        description: Joi.string().require(),
        managerComment: Joi.string().required(),
        userComment: Joi.string().required(),
    }),
    updateUserFormSchema: Joi.object({
        description: Joi.string(),
        managerComment: Joi.string(),
        userComment: Joi.string(),
    })
}

module.exports = userformValidation;