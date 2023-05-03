const Joi = require('joi');
const { FORM_CATEGORY_TYPES } = require("../config/constants");

const formValidation = {
    createFormSchema: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        dueTo: Joi.date().required(),
        UserIds: Joi.array().required(),
        formCategory: Joi.string().required().valid(...Object.values(FORM_CATEGORY_TYPES)),
    }),

    updateFormSchema: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        dueTo: Joi.date(),
        formCategory: Joi.string().valid(...Object.values(FORM_CATEGORY_TYPES)),
    })
}

module.exports = formValidation;