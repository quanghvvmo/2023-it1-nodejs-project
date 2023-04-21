import express from "express";
import {
    addFormController,
    updateFormController,
    getListFormsController,
    getFormController,
    deleteFormController,
} from "../controllers/form.controller.js";
import { authJWT, authorize } from "../middlewares/auth.middleware.js";

const formRouter = express.Router();

formRouter.get("/forms", authJWT, authorize, getListFormsController);
formRouter.get("/forms/:id", authJWT, authorize, getFormController);

formRouter.post("/forms", authJWT, authorize, addFormController);

formRouter.put("/forms/:id", authJWT, authorize, updateFormController);

formRouter.delete("/forms/:id", deleteFormController);

export default formRouter;
