import Joi from "joi";
import { FormCategory } from "../common/constant"


const formValidation = {
    validateForm: Joi.object({
        categoryName: Joi.string().required().valid(...Object.keys(FormCategory)),
        name: Joi.string().required(),
        expDate: Joi.date().required(),
        userIds: Joi.array(),
        managerId: Joi.string().required(),
    }),

    updateUserForm: Joi.object({
        userCmt: Joi.string().required(),
        description: Joi.string().required(),
    }),
    submitUserForm: Joi.object({
        userCmt: Joi.string().required(),
        descTask: Joi.string().required(),
    }),
    approvalUserForm: Joi.object({
        managerComment: Joi.string().required(),
        result: Joi.string().required(),
        point: Joi.number().greater(0).required(),
    })
}


module.exports = formValidation;