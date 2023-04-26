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
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }

        const userFormId = req.params.userFormId;

        const createdForm = await addUserFormDetail(userFormId, value);
        return res.status(httpStatus.CREATED).json(createdForm);
    } catch (error) {
        next(error);
    }
};

const getUserFormDetailController = async (req, res, next) => {
    try {
        const userFormDetailId = req.params.id;

        const userFormDetail = await getUserFormDetail(userFormDetailId);
        return res.status(httpStatus.OK).json(userFormDetail);
    } catch (error) {
        next(error);
    }
};

const updateUserFormDetailController = async (req, res, next) => {
    try {
        const { error, value } = updateUserFormDetailSchema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json(
                new APIError({
                    message: error.details[0].message,
                    status: httpStatus.BAD_REQUEST,
                })
            );
        }
        const userFormDetailId = req.params.id;

        const updatedUserFormDetailId = await updateUserFormDetail(userFormDetailId, value);
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
        const userFormDetailId = req.params.id;

        const userFormDetail = await deleteUserFormDetail(userFormDetailId);
        return res.status(httpStatus.OK).json(userFormDetail);
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
