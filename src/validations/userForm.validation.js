import Joi from "joi";

const updateUserFormSchema = Joi.object({
    userComment: Joi.string(),
});

export { updateUserFormSchema };
