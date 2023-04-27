const express = require('express');
const userFormController = require('../controllers/userFormController');
const { authenticate } = require('../middlewares/authMiddleware')
const userFormRouter = express.Router();

userFormRouter.get("/user-forms/:id", authenticate, userFormController.getUserFormDetailController);
userFormRouter.get("/user-forms", authenticate, userFormController.getListUserFormsController);
userFormRouter.put("/user-forms/:id", userFormController.updateUserFormController);
userFormRouter.delete("/user-forms/:id", userFormController.deleteUserFormController);

export default userFormRouter;