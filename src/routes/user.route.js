import express from "express";
import {
    loginController,
    addUserController,
    getUserDetailController,
    getListUsersController,
    updateUserController,
    deleteUserController,
    getCurrentUserDetailController,
} from "../controllers/user.controller.js";
import { authJWT, authorize } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/users", authJWT, authorize, getListUsersController);
userRouter.get("/users/current", authJWT, authorize, getCurrentUserDetailController);

userRouter.get("/users/:id", authJWT, authorize, getUserDetailController);

userRouter.post("/users/login", loginController);
userRouter.post("/users", authJWT, authorize, addUserController);

userRouter.put("/users/:id", authJWT, authorize, updateUserController);

userRouter.delete("/users/:id", authJWT, authorize, deleteUserController);

export default userRouter;
