import {
  GetListUserForm,
  EditUserForm,
  approvedForm,
  getListIncompletedForm,
  createFormDetails,
  EditUserFormDetail,
  getListCompletedForm,
  getAllFormsByStatus,
} from "../controllers/userFormControllers";
import express from "express";
import { verifyToken, authorize } from "../middlewares/auth.js";
const userFormRouter = express.Router();

userFormRouter.get("/userforms/", verifyToken, authorize, GetListUserForm);
userFormRouter.get(
  "/userforms/incompleted",
  verifyToken,
  authorize,
  getListIncompletedForm
);
userFormRouter.get("/userforms/completed", verifyToken, authorize, getListCompletedForm);
userFormRouter.get("/userforms/status", verifyToken, authorize, getAllFormsByStatus);
userFormRouter.post("/userforms/details", verifyToken, authorize, createFormDetails);
userFormRouter.put("/userforms/details/:id", verifyToken, authorize, EditUserFormDetail);
userFormRouter.put("/userforms/:id", verifyToken, authorize, EditUserForm);
userFormRouter.patch("/userforms/approve/:id", verifyToken, authorize, approvedForm);

export default userFormRouter;
