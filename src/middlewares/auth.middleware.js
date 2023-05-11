import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../config/index.js";
import sequelize from "../models/index.js";
import APIError from "../helper/apiError.js";
import { HTTP_METHODS } from "../constants/index.js";
import { authMessages } from "../constants/messages.constants.js";
import { UUID_REGEX } from "../_utils/regex_validation.js";

const { User, Role, RoleModules } = sequelize.models;

const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
        return req.headers.authorization.split(/\s+/)[1];
    }
};

const removePathParams = (path) => {
    let newPath = path.split("?")[0]; // remove query parameters
    let segments = newPath.split("/");

    for (let i = 0; i < segments.length; i++) {
        if (segments[i].match(UUID_REGEX)) {
            segments = segments.slice(0, i);
            break;
        }
    }

    newPath = segments.join("/");
    return newPath;
};

const authJWT = async (req, res, next) => {
    const token = getToken(req);
    const apiError = new APIError({});

    if (!token) {
        apiError.message = authMessages.NO_TOKEN;
        apiError.status = httpStatus.UNAUTHORIZED;
        return res.status(httpStatus.UNAUTHORIZED).json(apiError);
    }

    jwt.verify(token, config.tokenSecret, async (error, decoded) => {
        if (error) {
            apiError.message = authMessages.FAIL_AUTHENTICATE;
            apiError.status = httpStatus.UNAUTHORIZED;
            return res.status(httpStatus.UNAUTHORIZED).json(apiError);
        }
        const id = decoded.id;
        const user = await User.findOne({
            include: [Role],
            where: { id },
        });

        req.user = user;

        return next();
    });
};

const authorize = async (req, res, next) => {
    const user = req.user;
    const apiError = new APIError({});

    if (!user) {
        apiError.message = authMessages.NOT_LOGGED_IN;
        apiError.status = httpStatus.UNAUTHORIZED;
        return next(apiError);
    }

    let isPassPermission = false;
    const { Roles } = req.user;

    const path = removePathParams(req.originalUrl);
    const method = req.method.toString().toLowerCase();

    for (let i = 0; i < Roles.length; i++) {
        const roleModule = await RoleModules.findOne({ where: { api: path, RoleId: Roles[i].id } });
        if (!roleModule) break;

        switch (method) {
            case HTTP_METHODS.GET:
                if (roleModule.isCanRead) isPassPermission = true;
                break;
            case HTTP_METHODS.POST:
                if (roleModule.isCanWrite) isPassPermission = true;
                break;
            case HTTP_METHODS.PUT:
                if (roleModule.isCanUpdate) isPassPermission = true;
                break;
            case HTTP_METHODS.PATCH:
                if (roleModule.isCanUpdate) isPassPermission = true;
                break;
            case HTTP_METHODS.DELETE:
                if (roleModule.isCanDelete) isPassPermission = true;
                break;
        }

        if (isPassPermission) return next();
    }

    apiError.message = authMessages.AUTHORIZE_FORBIDDEN;
    apiError.status = httpStatus.FORBIDDEN;
    return next(apiError);
};

export { authJWT, authorize };
