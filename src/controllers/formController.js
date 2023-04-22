const formValidation = require("../validations/formValidation");
const formService = require('../services/formService');
const httpStatus = require('http-status');
const config = require('../config/index');

class FormController {
    createForm = async(req, res, next) => {
        try {
            const { error, value } = formValidation.createFormSchema.validate(req.body);
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
            }
            const currentUser = req.user;
            const form = await formService.createForm(currentUser, value);
            return res.status(httpStatus.CREATED).json(form);
        } catch (error) {
            next(error);
        }
    }

    getFormDetail = async(req, res, next) => {
        try {
            const { id } = req.params;
            const form = await formService.getFormDetail(id);
            return res.status(httpStatus.OK).json(form);
        } catch (error) {
            next(error);
        }
    }

    getListForms = async(req, res, next) => {
        try {
            const pageIndex = parseInt(req.query.pageIndex) || config.default_index_paging;
            const pageSize = parseInt(req.query.pageSize) || config.default_size_paging;
            const forms = await formService.getListForms(pageIndex, pageSize);
            return res.status(httpStatus.OK).json(forms);
        } catch (error) {
            next(error);
        }
    }

    updateForm = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { error, value } = formValidation.updateFormSchema.validate(req.body);
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
            }
            const currentUser = req.user;
            const form = await formService.updateForm(currentUser, id, value);
            return res.status(httpStatus.OK).json(form);
        } catch (error) {
            next(error);
        }
    };

    deleteForm = async (req, res, next) => {
        try {
            const { id } = req.params;
            const form = await formService.deleteForm(id);
            return res.status(httpStatus.OK).json(form);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new FormController();