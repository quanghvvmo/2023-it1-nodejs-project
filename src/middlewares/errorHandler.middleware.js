import httpStatus from "http-status";

import * as sequelize from "sequelize";

import APIError from "../helper/apiError.js";
import config from "../config/index.js";

const SequelizeError = sequelize.Error;
const { AggregateError, ValidationError, ForeignKeyConstraintError } = sequelize;

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err, req, res) => {
    const responseError = {
        code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (config.env !== "development" && config.env !== "localhost") {
        delete responseError.stack;
    }

    res.status(err.status).json(responseError);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (err, req, res, next) => {
    if (err instanceof APIError) return handler(err, req, res);
    let convertedError = err;

    if (err instanceof SequelizeError) {
        if (err.name.includes(ValidationError.name)) {
            convertedError = new APIError({
                message: "Validation Error",
                errors: err.errors.map((item) => {
                    return {
                        path: item.path,
                        message: item.message,
                    };
                }),
                status: httpStatus.UNPROCESSABLE_ENTITY,
            });
        } else if (err.name.includes(ForeignKeyConstraintError.name)) {
            convertedError = new APIError({
                message: "Validation Error",
                errors: err.fields.map((field) => {
                    return {
                        path: field,
                        message: "Data does not exist in reference table.", 
                    };
                }),
                status: httpStatus.UNPROCESSABLE_ENTITY,
            });
        } else {
            convertedError = new APIError({
                message: "Database Error",
                errors: err.message,
                status: httpStatus.INTERNAL_SERVER_ERROR,
                stack: err.stack,
            });
        }
    } else {
        convertedError = new APIError({
            message: err.message,
            status: httpStatus.INTERNAL_SERVER_ERROR,
            stack: err.stack,
        });
    }

    return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req, res, next) => {
    const err = new APIError({
        message: "URL Not found",
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res);
};
