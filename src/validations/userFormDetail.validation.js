import Joi from "joi";

const createUserFormDetailSchema = Joi.object({
    selfRating: Joi.string(),
    achievements: Joi.string(),
    description: Joi.string(),
    others: Joi.string(),
    result: Joi.string(),
});

const updateUserFormDetailSchema = Joi.object({
    selfRating: Joi.string(),
    achievements: Joi.string(),
    description: Joi.string(),
    others: Joi.string(),
    result: Joi.string(),
});

export { createUserFormDetailSchema, updateUserFormDetailSchema };
