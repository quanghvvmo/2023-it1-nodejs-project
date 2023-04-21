import express from "express";
import { loginController, createUserController, getUserByID, getListUser, deleteUser, editUser } from "../controllers/userControllers";
import { verifyToken, authorize } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/user/login", loginController);
userRouter.post("/user/createuser", verifyToken, authorize, createUserController);
userRouter.get("/user/:id", verifyToken, authorize, getUserByID);
userRouter.get("/user", verifyToken, getListUser);
userRouter.put("/user/:id", verifyToken, authorize, editUser);
userRouter.delete("/user/:id", verifyToken, authorize, deleteUser);
export default userRouter;
