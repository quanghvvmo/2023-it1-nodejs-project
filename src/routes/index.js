import express from "express";
import userRouter from "./userRoutes";
import formRouter from "./formRoutes";
const routers = express.Router();

routers.use(userRouter);
routers.use(formRouter);

export default routers;
