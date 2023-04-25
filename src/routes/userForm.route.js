import express from "express";
import {
    getUserFormController,
    updateUserFormController,
    getListUserFormsController,
    deleteUserFormController,
} from "../controllers/userForm.controller.js";

const userFormRouter = express.Router();

userFormRouter.get("/user-forms/:id", getUserFormController);
userFormRouter.get("/user-forms", getListUserFormsController);

userFormRouter.put("/user-forms/:id", updateUserFormController);

userFormRouter.delete("/user-forms/:id", deleteUserFormController);

export default userFormRouter;
