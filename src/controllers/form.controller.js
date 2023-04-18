import {
    addForm,
    getForm,
    getListForms,
    updateForm,
    deleteForm,
} from "../services/form.service.js";
import httpStatus from "http-status";
import { createFormSchema, updateFormSchema } from "../validations/form.validation.js";
import config from "../config/index.js";

const addFormController = async (req, res, next) => {
    try {
        const { error, value } = createFormSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const createdForm = await addForm(req.user, value);
        return res.status(httpStatus.CREATED).json(createdForm);
    } catch (error) {
        next(error);
    }
};

const updateFormController = async (req, res, next) => {
    try {
        const { error, value } = updateFormSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const updatedFormId = await updateForm(req.user, req.params.id, value);
        return res.status(httpStatus.OK).json(updatedFormId);
    } catch (error) {
        next(error);
    }
};

const getFormController = async (req, res, next) => {
    try {
        const form = await getForm(req.params.id);
        return res.status(httpStatus.OK).json(form);
    } catch (error) {
        next(error);
    }
};

const getListFormsController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const forms = await getListForms(pageIndex, pageSize);
        return res.status(httpStatus.OK).json(forms);
    } catch (error) {
        next(error);
    }
};

const deleteFormController = async (req, res, next) => {
    try {
        const formId = await deleteForm(req.params.id);
        return res.status(httpStatus.OK).json(formId);
    } catch (error) {
        next(error);
    }
};

export {
    addFormController,
    updateFormController,
    getListFormsController,
    getFormController,
    deleteFormController,
};
