import express from "express";
import { loginController } from "../controllers/userControllers";
const userRouter = express.Router();

userRouter.post("/user/login", loginController);

export default userRouter;
