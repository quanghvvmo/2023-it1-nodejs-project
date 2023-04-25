import express from "express";
import {
    addFormController,
    updateFormController,
    getListFormsController,
    getFormController,
    deleteFormController,
} from "../controllers/form.controller.js";

const formRouter = express.Router();

formRouter.get("/forms", getListFormsController);
formRouter.get("/forms/:id", getFormController);

formRouter.post("/forms", addFormController);

formRouter.put("/forms/:id", updateFormController);

formRouter.delete("/forms/:id", deleteFormController);

export default formRouter;
