import jwt from "jsonwebtoken";
const permissions = require("../database/models/permission");
import APIError from "../utils/errorHandler";
import httpStatus from "http-status";
import { USER_STATUS } from "../utils/constant";
import { errorResponse } from "../utils/responseHandler";

const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.length > 0) {
    return req.headers.authorization.split(/\s+/)[1];
  }
};

const verifyToken = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json(USER_STATUS.UNAUTHENTICATED);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json(USER_STATUS.AUTHENTICATION_FAIL);
    }
    req.user = user;
    next();
  });
};
const authorize = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json(USER_STATUS.UNAUTHENTICATED);
  }
  const path = req._parsedUrl.path;
  var api;
  if (path.lastIndexOf("/") != 0) {
    api = path.substring(0, path.lastIndexOf("/"));
  } else {
    api = path.substring(0, path.lastIndexOf("?"));
  }
  console.log("this is PATH: " + path);
  console.log("this is API: " + api);
  const { method } = req;
  let isPass = false;
  for (let i = 0; i < user.roles.length; i++) {
    let RoleId = user.roles[i];
    const permission = await permissions.findOne({ where: { api, RoleId } });
    if (permission) {
      switch (method) {
        case "GET":
          if (permission.read) isPass = true;
          break;
        case "POST":
          if (permission.write) isPass = true;
          break;
        case "PUT":
          if (permission.update) isPass = true;
          break;
        case "DELETE":
          if (permission.delete) isPass = true;
          break;
        case "PATCH":
          if (permission.approve) isPass = true;
          break;
      }
      if (isPass) return next();
    }
  }
  return next(
    new APIError({ message: USER_STATUS.PERMISSION, status: httpStatus.FORBIDDEN })
  );
};
export { verifyToken, authorize };
