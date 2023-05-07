import express from "express";
import userRouter from "./userRoutes";
import formRouter from "./formRoutes";
import userFormRouter from "./userFormRoutes";
const routers = express.Router();

routers.use(userRouter);
routers.use(formRouter);
routers.use(userFormRouter);

export default routers;
