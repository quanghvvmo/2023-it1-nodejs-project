import { login } from "../services/userServices";
import httpStatus from "http-status";
import { Loginschema } from "../validate/userValidate";
const User = require("../database/models/user");

const loginController = async (req, res, next) => {
  try {
    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }

    const token = await login(value);
    return res.status(httpStatus.OK).json({ token });
  } catch (error) {
    next(error);
  }
};
export { loginController };
