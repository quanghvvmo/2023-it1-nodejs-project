import Joi from "joi";
import { FormCategory } from '../common/constant'


const formValidation = {
    validateForm: Joi.object({
        category: Joi.string().required().valid(...Object.keys(FormCategory)),
        name: Joi.string().required(),
        expDate: Joi.date().required(),
        userid: Joi.array(),
        managerid: Joi.string().required(),
    }),

    updateUserForm: Joi.object({
        userComment: Joi.string().required(),
        description: Joi.string().required(),
    }),
    submitUserForm: Joi.object({
        userComment: Joi.string().required(),
        descTask: Joi.string().required(),
    }),
    approvalUserForm: Joi.object({
        managerComment: Joi.string().required(),
        result: Joi.string.required(),
        point: Joi.number().greater(0).required(),
    })
}


module.exports = formValidation;