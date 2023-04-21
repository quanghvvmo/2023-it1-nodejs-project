import formService from '../_services/formService'
import formValidation from '../validation/formValidation'

class UserController {
    createForm = async (req, res) => {
        try {
            let result = {};
            let data = req.body;
            const { error, value } = formValidation.validateForm.validate(data)
            if (error) {
                return res.status(500).json(error.details[0].message);
            }
            if (data.userid && data.userid.length > 0) {
                result = await formService.createUserForm(value);
            } else {
                result = await formService.createForm(value);
            }
            if (result.errCode === 0) {
                return res.status(200).json(result);
            } else if (result.errCode === -1) {
                return res.status(500).json(result);
            } else return res.status(400).json(result)
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    myForm = async (req, res) => {
        try {
            const userid = req.user.id;
            const result = await formService.myForm(userid);
            if (result.errCode === 0) {
                return res.status(200).json(result);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    updateUserForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.updateUserForm.validate(data);
            if (error) {
                return res.status(500).json(error.details[0].message);
            }
            const result = await formService.updateUserForm(value, req.params.id, req.user);
            if (result.errCode === 0) {
                return res.status(200).json(result);
            }
            return res.status(404).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
    submitForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.submitUserForm.validate(data);
            if (error) {
                return res.status(500).json(error.details[0].message);
            }
            const result = await formService.submitUserForm(value, req.params.id, req.user);
            if (result.errCode === 0) {
                return res.status(200).json(result);
            }
            return res.status(404).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
    approvalForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.approvalUserForm.validate(data);
            if (error) {
                return res.status(500).json(error.details[0].message);
            }
            const result = await formService.approvalForm(value, req.params.id);
            if (result.errCode === 0) {
                return res.status(200).json(result);
            }
            return res.status(404).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
}

module.exports = new UserController();