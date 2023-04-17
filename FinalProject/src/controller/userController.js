import UserService from '../_services/userService'
import userValidation from '../validation/userValidation'

class UserController {

    handleLogin = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = userValidation.login.validate(data);
            if (error) {
                return res.status(400).json(error.details[0].message)
            }
            let result = await UserService.handleLogin(value);
            if (result.errCode === 0) {
                return res.status(200).json(result);
            } else if (result.errCode === -1) {
                return res.status(404).json(result)
            } else return res.status(400).json(result)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
                return res.status(400).json(error.details[0].message)
            }
            let result = await UserService.createUser(value, avatar);
            if (result.errCode === 1) {
                return res.status(400).json(result);
            } else if (result.errCode === 0) {
                return res.status(201).json(result);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    };

    updateUser = async (req, res) => {
        try {
            const data = req.body;
            if (!data.id) {
                return res.status(400).json({
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
                return res.status(400).json(error.details[0].message)
            }
            let result = await UserService.updateUser(value, avatar);
            if (result.errCode === -1) {
                return res.status(404).json(result);
            } else return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json(error);
        }
    };

    softDelete = async (req, res) => {
        try {
            const userid = req.params.id
            let result = await UserService.softDelete(userid);
            if (result.errCode === -1) {
                return res.status(404).json(result)
            } else return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = new UserController();
