const userFormDetailValidation = require("../validations/userFormDetailValidation");
const userFormDetailService = require('../services/userFormDetailService');
const httpStatus = require('http-status');
const config = require('../config/index');

class UserFormDetailController {
    createUserFormDetail = async(req, res, next) => {
        try {
            const { error, value } = userFormDetailValidation.createUserFormDetailSchema.validate(req.body);
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
            }
            const { UserFormId } = req.params;
            const userFormDetail = await userFormDetailService.createUserFormDetail(UserFormId, value);
            return res.status(httpStatus.CREATED).json(userFormDetail);
        } catch (error) {
            next(error);
        }
    }

    getUserFormDetail = async(req, res, next) => {
        try {
            const { id } = req.params;
            const userFormDetail = await userFormDetailService.getUserFormDetail(id);
            return res.status(httpStatus.OK).json(userFormDetail);
        } catch (error) {
            next(error);
        }
    }

    getListUserFormDetails = async(req, res, next) => {
        try {
            const pageIndex = parseInt(req.query.pageIndex) || config.defaultIndexPaging;
            const pageSize = parseInt(req.query.pageSize) || config.defaultSizePaging;
            const userFormDetails = await userFormDetailService.getListUserFormDetails(pageIndex, pageSize);
            return res.status(httpStatus.OK).json(userFormDetails);
        } catch (error) {
            next(error);
        }
    }

    updateUserFormDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { error, value } = userFormDetailValidation.updateUserFormDetailSchema.validate(req.body);
            if (error) {
                return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
            }
            const userFormDetail = await userFormDetailService.updateUserFormDetail(id, value);
            return res.status(httpStatus.OK).json(userFormDetail);
        } catch (error) {
            next(error);
        }
    };

    deleteUserFormDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userFormDetail = await userFormDetailService.deleteUserFormDetail(id);
            return res.status(httpStatus.OK).json(userFormDetail);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserFormDetailController();