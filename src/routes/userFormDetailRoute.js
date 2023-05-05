
const express = require('express');
const userFormDetailController = require('../controllers/userFormDetailController');
const userFormDetailRouter = express.Router();

userFormDetailRouter.get("/user-forms-detail", userFormDetailController.getListUserFormDetails);
userFormDetailRouter.get("/user-forms-detail/:id", userFormDetailController.getUserFormDetail);

userFormDetailRouter.post("/user-forms-detail/:userFormId", userFormDetailController.createUserFormDetail);

userFormDetailRouter.put("/user-forms-detail/:id", userFormDetailController.updateUserFormDetail);

userFormDetailRouter.delete("/user-forms-detail/:id", userFormDetailController.deleteUserFormDetail);

module.exports = userFormDetailRouter;