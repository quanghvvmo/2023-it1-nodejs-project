const express = require('express');
const formController = require('../controllers/formController');
const formRouter = express.Router();

formRouter.post("/forms", formController.createForm);

formRouter.get("/forms", formController.getListForms);
formRouter.get("/forms/:id", formController.getFormDetail);

formRouter.put("/forms/:id", formController.updateForm);
formRouter.delete("/forms/:id", formController.deleteForm);

module.exports = formRouter;