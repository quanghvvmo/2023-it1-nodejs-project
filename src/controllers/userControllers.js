import { login, createUser, getUser } from "../services/userServices";
import httpStatus from "http-status";
import { Loginschema, UserSchema } from "../validate/userValidate";
const User = require("../database/models/user");
import verifyToken from "../middlewares/auth";

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

const createUserController = async (req, res, next) => {
  try {
    const { error, value } = UserSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json(error.details[0].message);
    }
    const user = await createUser(value);
    res.status(httpStatus.CREATED).json(user);
  } catch (err) {
    next(err);
  }
};
const getUserByID = async (req, res, next) => {
  try {
    const id = req.params.id || 0;
    const user = await getUser(id);
    res.status(httpStatus.FOUND).json(user);
  } catch (err) {
    next(err);
  }
};
export { loginController, createUserController, getUserByID };
