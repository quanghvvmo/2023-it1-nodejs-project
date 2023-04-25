import Joi from "joi";

const updateUserFormSchema = Joi.object({
    userComment: Joi.string(),
    managerComment: Joi.string(),
});

export { updateUserFormSchema };
