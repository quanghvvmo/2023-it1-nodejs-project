const Joi = require('joi');

const userformValidation = {
    updateUserFormSchema: Joi.object({
        description: Joi.string(),
        ManagerId: Joi.string(),
        userComment: Joi.string(),
    }),
    approveUserFormSchema: Joi.object({
        userIds: Joi.array().required(),
        managerComment: Joi.string(),
    }),
    closeUserFormSchema: Joi.object({
        userIds: Joi.array().required()
    })
}

module.exports = userformValidation;