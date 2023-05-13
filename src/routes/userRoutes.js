import express from "express";
import {
  loginController,
  createUserController,
  getUserByID,
  getListUser,
  deleteUser,
  editUser,
  getCurrentUserDetails,
} from "../controllers/userControllers";
import { verifyToken, authorize } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/users/:id", verifyToken, authorize, getUserByID);
userRouter.get("/users/details", verifyToken, authorize, getCurrentUserDetails);
userRouter.get("/users", verifyToken, getListUser);
userRouter.post("/users/login", loginController);
userRouter.post("/users", verifyToken, authorize, createUserController);
userRouter.put("/users/:id", verifyToken, authorize, editUser);
userRouter.delete("/users/:id", verifyToken, authorize, deleteUser);
export default userRouter;
