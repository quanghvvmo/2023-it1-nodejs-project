const User = require("../database/models/user");
const httpStatus = require("http-status");
import APIError from "../utils/errorHandler";
import response from "../utils/responseHandler";
import generateToken from "./tokenService";
const login = async (payload) => {
  const user = await User.findOne({ where: { username: payload.username } });
  if (!user) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.NOT_FOUND,
    });
  }
  if (user.password !== payload.password) {
    throw new APIError({
      message: "Wrong username or password",
      status: httpStatus.UNAUTHORIZED,
    });
  }
  const token = generateToken(payload);
  return new response(httpStatus.OK, "Login successful", token);
};
export { login };
