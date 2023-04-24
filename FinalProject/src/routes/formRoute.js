import express from "express";
import FormController from "../controller/formController";
import authService from "../middleware/auth";

const formRouter = express.Router();

formRouter.post("/form/create", FormController.createForm)
formRouter.get("/form/my-form", authService.authJWT, FormController.myForm)
formRouter.post("/form/submit-form/:id", authService.authJWT, FormController.submitForm)
formRouter.post("/form/approval-form/:id", authService.authJWT, FormController.approvalForm)
formRouter.put("/form/user-update-form/:id", authService.authJWT, FormController.updateUserForm)
formRouter.get("/form/report-labour", FormController.reportLabour)
formRouter.get("/form/report-performance", FormController.reportPerfomance)

module.exports = formRouter