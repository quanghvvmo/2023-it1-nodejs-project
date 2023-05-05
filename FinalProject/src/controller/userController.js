import userService from "../_services/userService"
import userValidation from "../validation/userValidation"
import status from "http-status";
import config from "../config";

class UserController {

    handleLogin = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = userValidation.login.validate(data);
            if (error) {
                return res.status(status.BAD_REQUEST).json(error.details[0].message)
            }
            const result = await userService.handleLogin(value);
            return res.status(result.status).json(result);
        } catch (error) {
            console.log(error);
            return res.status(status.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    createUser = async (req, res) => {
        try {
            const data = req.body;
            let avatar = "";
            if (!req.file) {
                avatar = null;
            } else {
                avatar = req.file.filename;
            }
            const { error, value } = userValidation.validateUser.validate(data);
            if (error) {
                return res.status(status.BAD_REQUEST).json(error.details[0].message)
            }
            const result = await userService.createUser(value, avatar);
            return res.status(result.status).json(result);

        } catch (error) {
            console.log(error);
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    };

    updateUser = async (req, res) => {
        try {
            const data = req.body;
            const userId = req.params.id;
            let avatar = "";
            if (!req.file) {
                avatar = null;
            } else {
                avatar = req.file.filename;
            }
            const { error, value } = userValidation.updateUser.validate(data);
            if (error) {
                return res.status(status.BAD_REQUEST).json(error.details[0].message)
            }
            const result = await userService.updateUser(value, userId, avatar);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    };

    softDelete = async (req, res) => {
        try {
            const userId = req.params.id
            const result = await userService.softDelete(userId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    getUserById = async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await userService.getUserById(userId);
            return res.status(result.status).json(result)

        } catch (error) {
            console.log(error);
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    };

    getAllUser = async (req, res) => {
        try {
            const pageIndex = parseInt(req.query.pageIndex) || config.query_default_page_index;
            const pageSize = parseInt(req.query.pageSize) || config.query_default_page_size;
            const result = await userService.getAllUser(pageIndex, pageSize);
            return res.status(result.status).json(result)
        } catch (error) {
            console.log(error);
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    }
}

module.exports = new UserController();
