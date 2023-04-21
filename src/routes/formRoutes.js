import express from "express";
const formRouter = express.Router();
import { createNewForm } from "../controllers/formControllers";

formRouter.post("/form", createNewForm);
export default formRouter;
