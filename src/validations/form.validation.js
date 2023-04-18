import Joi from "joi";
import { FormCategories } from "../_utils/constants.js";

const createFormSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    userIds: Joi.array().required(),
    formCategory: Joi.string()
        .required()
        .valid(...Object.keys(FormCategories)),
});

const updateFormSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    dueDate: Joi.date(),
    formCategory: Joi.string().valid(...Object.keys(FormCategories)),
});

export { createFormSchema, updateFormSchema };
