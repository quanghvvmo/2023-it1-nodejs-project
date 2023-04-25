import express from "express";
import {
    addUserFormDetailController,
    getUserFormDetailController,
    updateUserFormDetailController,
    getListUserFormDetailsController,
    deleteUserFormDetailController,
} from "../controllers/userFormDetail.controller.js";

const userFormDetailRouter = express.Router();

userFormDetailRouter.get("/user-forms-detail", getListUserFormDetailsController);
userFormDetailRouter.get("/user-forms-detail/:id", getUserFormDetailController);

userFormDetailRouter.post("/user-forms-detail/:userFormId", addUserFormDetailController);

userFormDetailRouter.put("/user-forms-detail/:id", updateUserFormDetailController);

userFormDetailRouter.delete("/user-forms-detail/:id", deleteUserFormDetailController);

export default userFormDetailRouter;
