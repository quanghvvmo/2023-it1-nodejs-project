import express from "express";
const formRouter = express.Router();
import { verifyToken, authorize } from "../middlewares/auth.js";
import {
  createNewForm,
  editForm,
  close,
  getForms,
  getAllFormsByStatus,
} from "../controllers/formControllers";
formRouter.get("/forms/status", getAllFormsByStatus);
formRouter.get("/forms", verifyToken, authorize, getForms);
formRouter.post("/forms", verifyToken, authorize, createNewForm);
formRouter.put("/forms/:id", verifyToken, authorize, editForm);
formRouter.delete("/forms/:id", verifyToken, authorize, close);
export default formRouter;
