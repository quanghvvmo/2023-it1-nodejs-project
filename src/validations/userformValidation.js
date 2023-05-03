const Joi = require('joi');

const userformValidation = {
    updateUserFormSchema: Joi.object({
        description: Joi.string(),
        ManagerId: Joi.string(),
        userComment: Joi.string(),
    })
}

module.exports = userformValidation;