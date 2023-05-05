import express from "express";
import FormController from "../controller/formController";
import authService from "../middleware/auth";


const formRouter = express.Router();

formRouter.post("/form/create", authService.authJWT, authService.authorizationUser, FormController.createForm)
formRouter.get("/form/employee-form", authService.authJWT, authService.authorizationUser, FormController.formForEmployee)
formRouter.get("/form/manager-form", authService.authJWT, authService.authorizationUser, FormController.formForManager)
formRouter.post("/form/submit-form/:id", authService.authJWT, authService.authorizationUser, FormController.submitForm)
formRouter.patch("/form/close-user-form/:id", authService.authJWT, authService.authorizationUser, FormController.closeUserForm)
formRouter.post("/form/approval-form/:id", authService.authJWT, authService.authorizationUser, FormController.approvalForm)
formRouter.put("/form/user-update-form/:id", authService.authJWT, authService.authorizationUser, FormController.updateUserForm)
formRouter.get("/form/report-labour", authService.authJWT, authService.authorizationUser, FormController.reportLabour)
formRouter.get("/form/report-performance", authService.authJWT, authService.authorizationUser, FormController.reportPerfomance)

module.exports = formRouter