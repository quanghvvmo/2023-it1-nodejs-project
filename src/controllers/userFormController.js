const httpStatus = require("http-status");
const config = require('../config/index')
const userFormService = require("../services/userFormService");
const userFormValidation = require('../validations/userFormValidation');

class UserFormController {
    getUserFormDetail = async (req, res, next) => {
        try {
            const currentUser = req.user;
            const { id } = req.params;

            const userForm = await userFormService.getUserFormDetail(currentUser, id);
            return res.status(httpStatus.OK).json(userForm);
        } catch (error) {
            next(error)
        }
    }

    getListUserForms = async (req, res, next) => {
        try {
            const currentUser = req.user;
            const pageIndex = parseInt(req.query.pageIndex) || config.defaultIndexPaging;
            const pageSize = parseInt(req.query.pageSize) || config.defaultSizePaging;
            const { status } = req.query;
            const userForms = await userFormService.getListUserForms(currentUser, pageIndex, pageSize, status);
            return res.status(httpStatus.OK).json(userForms);
        } catch (error) {
            next(error);
        }
    };

    updateUserForm = async (req, res, next) => {
        try {
            const { error, value } = userFormValidation.updateUserFormSchema.validate(req.body);
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
            }

            const { id } = req.params;
            const userForm = await userFormService.updateUserForm(id, value);
            return res.status(httpStatus.OK).json(userForm);
        } catch (error) {
            next(error);
        }
    }

    deleteUserForm = async (req, res, next) => {
        try {
            const { id } = req.params;    
            const userForm = await userFormService.deleteUserForm(id);
            return res.status(httpStatus.OK).json(userForm);
        } catch (error) {
            next(error);
        }
    };

    approveUserForm = async (req, res, next) => {
        try {
            const { error, value } = userFormValidation.approveUserFormSchema.validate(req.body);   
            const userForm = await userFormService.approveUserForm(value);
            return res.status(httpStatus.OK).json(userForm);
        } catch (error) {
            next(error);
        }
    };

    closeUserForm = async (req, res, next) => {
        try {
            const { error, value } = userFormValidation.closeUserFormSchema.validate(req.body);   
            const userForm = await userFormService.closeUserForm(value);
            return res.status(httpStatus.OK).json(userForm);
        } catch (error) {
            next(error);
        }
    };

}

module.exports = new UserFormController();