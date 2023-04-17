import express from "express";
import { loginController, createUserController, getUserByID } from "../controllers/userControllers";
import verifyToken from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/user/login", loginController);
userRouter.post("/user/createuser", verifyToken, createUserController);
userRouter.get("/user/:id", verifyToken, getUserByID);
export default userRouter;
