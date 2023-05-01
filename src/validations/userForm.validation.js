import Joi from "joi";

const updateUserFormSchema = Joi.object({
    userComment: Joi.string(),
    ManagerId: Joi.string(),
});

const approveUserFormSchema = Joi.object({
    managerComment: Joi.string(),
});

export { updateUserFormSchema, approveUserFormSchema };
