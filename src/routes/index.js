import express from "express";
import userRouter from "./user.route.js";
import formRouter from "./form.route.js";
import userFormRouter from "./userForm.route.js";
import userFormDetailRouter from "./userFormDetail.route.js";
import { authJWT, authorize } from "../middlewares/auth.middleware.js";

const routers = express.Router();
routers.use(userRouter);
routers.use(authJWT, authorize, formRouter);
routers.use(authJWT, authorize, userFormRouter);
routers.use(authJWT, authorize, userFormDetailRouter);

export default routers;
