import Joi from "joi";
import { FORM_CATEGORIES } from "../constants/index.js";

const createFormSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    userIds: Joi.array().required(),
    formCategory: Joi.string()
        .required()
        .valid(...Object.keys(FORM_CATEGORIES)),
    ManagerId: Joi.string(),
});

const updateFormSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    dueDate: Joi.date(),
    formCategory: Joi.string().valid(...Object.keys(FORM_CATEGORIES)),
    ManagerId: Joi.string(),
});

export { createFormSchema, updateFormSchema };
