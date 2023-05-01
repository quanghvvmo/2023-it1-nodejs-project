import {
    getUserForm,
    getListUserForms,
    updateUserForm,
    deleteUserForm,
    getListUserFormsSubmitted,
    getListUserFormsUnsubmitted,
    approveUserForm,
    closeUserForm,
} from "../services/userForm.service.js";
import { updateUserFormSchema, approveUserFormSchema } from "../validations/userForm.validation.js";
import httpStatus from "http-status";
import config from "../config/index.js";
import { FORM_CATEGORIES } from "../constants/index.js";

const getUserFormController = async (req, res, next) => {
    try {
        const currentUser = req.user;
        const userFormId = req.params.id;

        const userForm = await getUserForm(currentUser, userFormId);
        return res.status(httpStatus.OK).json(userForm);
    } catch (error) {
        next(error);
    }
};

const updateUserFormController = async (req, res, next) => {
    try {
        const { error, value } = updateUserFormSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const userFormId = req.params.id;

        const updatedUserFormId = await updateUserForm(userFormId, value);
        return res.status(httpStatus.OK).json(updatedUserFormId);
    } catch (error) {
        next(error);
    }
};

const approveUserFormController = async (req, res, next) => {
    try {
        const { error, value } = approveUserFormSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const userFormId = req.params.id;

        const approvedUserFormId = await approveUserForm(userFormId, value);
        return res.status(httpStatus.OK).json(approvedUserFormId);
    } catch (error) {
        next(error);
    }
};

const closeUserFormController = async (req, res, next) => {
    try {
        const userFormId = req.params.id;

        const closedUserFormId = await closeUserForm(userFormId);
        return res.status(httpStatus.OK).json(closedUserFormId);
    } catch (error) {
        next(error);
    }
};

const getListUserFormsController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.defaultIndexPagination;
            pageSize = config.defaultSizePagination;
        }

        const userForms = await getListUserForms(req.user, pageIndex, pageSize);
        return res.status(httpStatus.OK).json(userForms);
    } catch (error) {
        next(error);
    }
};

const getListUserFormsReportController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.defaultIndexPagination;
            pageSize = config.defaultSizePagination;
        }

        const { formCategory } = req.query;
        if (!Object.keys(FORM_CATEGORIES).includes(formCategory)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "formCategory parameter is required and value only PROBATIONARY or ANNUAL",
                status: httpStatus.BAD_REQUEST,
            });
        }

        const userForms = await getListUserFormsSubmitted(pageIndex, pageSize, formCategory);
        return res.status(httpStatus.OK).json(userForms);
    } catch (error) {
        next(error);
    }
};

const getListUserFormsReportUnsubmittedController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.defaultIndexPagination;
            pageSize = config.defaultSizePagination;
        }

        const { formCategory } = req.query;
        if (!Object.keys(FORM_CATEGORIES).includes(formCategory)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "formCategory parameter is required and value only PROBATIONARY or ANNUAL",
                status: httpStatus.BAD_REQUEST,
            });
        }

        const userForms = await getListUserFormsUnsubmitted(pageIndex, pageSize, formCategory);
        return res.status(httpStatus.OK).json(userForms);
    } catch (error) {
        next(error);
    }
};

const deleteUserFormController = async (req, res, next) => {
    try {
        const userFormId = req.params.id;

        const userForm = await deleteUserForm(userFormId);
        return res.status(httpStatus.OK).json(userForm);
    } catch (error) {
        next(error);
    }
};

export {
    getUserFormController,
    updateUserFormController,
    getListUserFormsController,
    deleteUserFormController,
    getListUserFormsReportController,
    getListUserFormsReportUnsubmittedController,
    closeUserFormController,
    approveUserFormController,
};
