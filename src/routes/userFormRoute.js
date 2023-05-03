const express = require('express');
const userFormController = require('../controllers/userFormController');
const userFormRouter = express.Router();

userFormRouter.get("/user-forms/:id", userFormController.getUserFormDetail);
userFormRouter.get("/user-forms", userFormController.getListUserForms);

userFormRouter.get("/user-forms/submitted", userFormController.getListSubmittedUserForms);
userFormRouter.get("/user-forms/unsubmitted", userFormController.getListUnsubmittedUserForms);

userFormRouter.patch("/user-forms/approve/:id", userFormController.approveUserForm);
userFormRouter.patch("/user-forms/close/:id", userFormController.closeUserForm);
userFormRouter.patch("/user-forms/submit/:id", userFormController.submitUserForm);

userFormRouter.put("/user-forms/:id", userFormController.updateUserForm);

userFormRouter.delete("/user-forms/:id", userFormController.deleteUserForm);

module.exports = userFormRouter;