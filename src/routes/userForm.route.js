import express from "express";
import { getUserFormController } from "../controllers/userForm.controller.js";
import { authJWT, authorize } from "../middlewares/auth.middleware.js";

const userFormRouter = express.Router();

userFormRouter.get("/user-forms/:id", authJWT, authorize, getUserFormController);

export default userFormRouter;
