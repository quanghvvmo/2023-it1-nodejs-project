import express from "express";
import userRouter from "./user.route.js";
import formRouter from "./form.route.js";
import userFormRouter from "./userForm.route.js";

const routers = express.Router();
routers.use(userRouter);
routers.use(formRouter);
routers.use(userFormRouter);

export default routers;
