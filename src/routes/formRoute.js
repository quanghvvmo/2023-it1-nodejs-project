const express = require('express');
const formController = require('../controllers/formController');
const { authenticate } = require('../middlewares/authMiddleware');

const formRouter = express.Router();

formRouter.post("/forms", authenticate, formController.createForm);

formRouter.get("/forms", authenticate, formController.getListForms);
formRouter.get("/forms/:id", authenticate, formController.getFormDetail);

formRouter.put("/forms/:id", authenticate, formController.updateForm);
formRouter.delete("/forms/:id", authenticate, formController.deleteForm);

module.exports = formRouter;