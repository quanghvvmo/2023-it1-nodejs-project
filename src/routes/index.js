import express from "express";
import userRouter from "./user.route.js";

const routers = express.Router();
routers.use(userRouter);

export default routers;
