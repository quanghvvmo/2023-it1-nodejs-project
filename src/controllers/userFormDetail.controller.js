import {
    addUserFormDetail,
    updateUserFormDetail,
    deleteUserFormDetail,
    getUserFormDetail,
    getListUserFormsDetail,
} from "../services/userFormDetail.service.js";
import {
    createUserFormDetailSchema,
    updateUserFormDetailSchema,
} from "../validations/userFormDetail.validation.js";
import httpStatus from "http-status";
import config from "../config/index.js";

const addUserFormDetailController = async (req, res, next) => {
    try {
        const { error, value } = createUserFormDetailSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const createdForm = await addUserFormDetail(req.params.userFormId, value);
        return res.status(httpStatus.CREATED).json(createdForm);
    } catch (error) {
        next(error);
    }
};

const getUserFormDetailController = async (req, res, next) => {
    try {
        const userFormDetail = await getUserFormDetail(req.params.id);
        return res.status(httpStatus.OK).json(userFormDetail);
    } catch (error) {
        next(error);
    }
};

const updateUserFormDetailController = async (req, res, next) => {
    try {
        const { error, value } = updateUserFormDetailSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
        }

        const updatedUserFormDetailId = await updateUserFormDetail(req.params.id, value);
        return res.status(httpStatus.OK).json(updatedUserFormDetailId);
    } catch (error) {
        next(error);
    }
};

const getListUserFormDetailsController = async (req, res, next) => {
    try {
        let pageIndex = parseInt(req.query.pageIndex);
        let pageSize = parseInt(req.query.pageSize);
        if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
            pageIndex = config.default_index_pagination;
            pageSize = config.default_size_pagination;
        }

        const userFormDetails = await getListUserFormsDetail(pageIndex, pageSize);
        return res.status(httpStatus.OK).json(userFormDetails);
    } catch (error) {
        next(error);
    }
};

const deleteUserFormDetailController = async (req, res, next) => {
    try {
        const userFormDetailId = await deleteUserFormDetail(req.params.id);
        return res.status(httpStatus.OK).json(userFormDetailId);
    } catch (error) {
        next(error);
    }
};

export {
    addUserFormDetailController,
    getUserFormDetailController,
    updateUserFormDetailController,
    getListUserFormDetailsController,
    deleteUserFormDetailController,
};
