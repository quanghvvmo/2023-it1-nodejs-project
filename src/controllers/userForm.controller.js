import { getUserForm } from "../services/userForm.service.js";
import httpStatus from "http-status";
import config from "../config/index.js";

const getUserFormController = async (req, res, next) => {
    try {
        const userForm = await getUserForm(req.user, req.params.id);
        return res.status(httpStatus.OK).json(userForm);
    } catch (error) {
        next(error);
    }
};

export { getUserFormController };
