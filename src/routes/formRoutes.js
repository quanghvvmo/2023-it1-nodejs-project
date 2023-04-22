import express from "express";
const formRouter = express.Router();
import { verifyToken, authorize } from "../middlewares/auth.js";
import { createNewForm, editForm, close, getForms } from "../controllers/formControllers";
formRouter.get("/form", verifyToken, authorize, getForms);
formRouter.post("/form/createform", verifyToken, authorize, createNewForm);
formRouter.put("/form/:id", verifyToken, authorize, editForm);
formRouter.delete("/form/:id", verifyToken, authorize, close);
export default formRouter;
