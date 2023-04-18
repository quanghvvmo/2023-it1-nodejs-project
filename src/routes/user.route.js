import express from "express";
import {
    loginController,
    addUserController,
    getUserDetailController,
    getListUsersController,
    updateUserController,
    deleteUserController,
} from "../controllers/user.controller.js";
import { authJWT, authorize } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/users", getListUsersController);
userRouter.get("/users/:id", getUserDetailController);

userRouter.post("/users/login", loginController);
userRouter.post("/users", addUserController);

userRouter.put("/users/:id", updateUserController);

userRouter.delete("/users/:id", deleteUserController);

export default userRouter;
