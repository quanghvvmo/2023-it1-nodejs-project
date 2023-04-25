import userService from "../_services/userService"
import userValidation from "../validation/userValidation"
import status from "http-status";

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
            if (!data.id) {
                return res.status(status.BAD_REQUEST).json({
                    errMsg: "Missing User id!"
                })
            }
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
            const result = await userService.updateUser(value, avatar);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
    };

    softDelete = async (req, res) => {
        try {
            const userid = req.params.id
            const result = await userService.softDelete(userid);
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
}

module.exports = new UserController();
