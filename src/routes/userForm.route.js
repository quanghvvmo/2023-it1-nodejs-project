import express from "express";
import {
    getUserFormController,
    updateUserFormController,
    getListUserFormsController,
    deleteUserFormController,
    getListUserFormsReportController,
    getListUserFormsReportUnsubmittedController,
    closeUserFormController,
    approveUserFormController,
} from "../controllers/userForm.controller.js";

const userFormRouter = express.Router();

userFormRouter.get("/user-forms/report-submitted", getListUserFormsReportController);
userFormRouter.get("/user-forms/report-unsubmitted", getListUserFormsReportUnsubmittedController);
userFormRouter.get("/user-forms/:id", getUserFormController);
userFormRouter.get("/user-forms", getListUserFormsController);

userFormRouter.patch("/user-forms/approve/:id", approveUserFormController);
userFormRouter.patch("/user-forms/close/:id", closeUserFormController);

userFormRouter.put("/user-forms/:id", updateUserFormController);

userFormRouter.delete("/user-forms/:id", deleteUserFormController);

export default userFormRouter;
