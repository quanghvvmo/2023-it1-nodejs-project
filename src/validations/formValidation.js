const Joi = require('joi');
const formCategoryTypes = require("../constants/types/formCategory")

const formValidation = {
    createFormSchema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        dueTo: Joi.date().required(),
        userIds: Joi.array().required(),
        formCategory: Joi.string().required().valid(Object.keys(formCategoryTypes)),
    }),

    updateFormSchema: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        dueTo: Joi.date(),
        formCategory: Joi.string().valid(Object.keys(formCategoryTypes)),
    })
}

module.exports = formValidation;