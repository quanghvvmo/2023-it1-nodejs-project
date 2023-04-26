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
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const currentUser = req.user;
        const createdForm = await addForm(currentUser, value);

        return res.status(httpStatus.CREATED).json(createdForm);
    } catch (error) {
        next(error);
    }
};

const updateFormController = async (req, res, next) => {
    try {
        const { error, value } = updateFormSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const currentUser = req.user;
        const formId = req.params.id;

        const updatedFormId = await updateForm(currentUser, formId, value);
        return res.status(httpStatus.OK).json(updatedFormId);
    } catch (error) {
        next(error);
    }
};

const getFormController = async (req, res, next) => {
    try {
        const formId = req.params.id;

        const form = await getForm(formId);
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
        const formId = req.params.id;

        const form = await deleteForm(formId);
        return res.status(httpStatus.OK).json(form);
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
