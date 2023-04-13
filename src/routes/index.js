import express from "express";
import userRouter from "./userRoutes";
const routers = express.Router();

routers.use(userRouter);

export default routers;
