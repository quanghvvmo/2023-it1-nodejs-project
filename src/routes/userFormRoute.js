const express = require('express');
const userFormController = require('../controllers/userFormController');
const userFormRouter = express.Router();

userFormRouter.get("/user-forms/:id", userFormController.getUserFormDetail);
userFormRouter.get("/user-forms", userFormController.getListUserForms);

userFormRouter.patch("/user-forms/approve", userFormController.approveUserForm);
userFormRouter.patch("/user-forms/close", userFormController.closeUserForm);

userFormRouter.put("/user-forms/:id", userFormController.updateUserForm);

userFormRouter.delete("/user-forms/:id", userFormController.deleteUserForm);

module.exports = userFormRouter;