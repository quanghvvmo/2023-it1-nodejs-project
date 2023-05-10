import {
  GetListUserForm,
  EditUserForm,
  approvedForm,
  getListIncompletedForm,
  getListForm,
  createFormDetails,
  EditUserFormDetail,
  getListCompletedForm,
} from "../controllers/userFormControllers";
import express from "express";
import { verifyToken, authorize } from "../middlewares/auth.js";
const userFormRouter = express.Router();

userFormRouter.get("/userform/", verifyToken, authorize, GetListUserForm);
userFormRouter.get(
  "/userform/incompleted",
  verifyToken,
  authorize,
  getListIncompletedForm
);
userFormRouter.get("/userform/completed", verifyToken, authorize, getListCompletedForm);
userFormRouter.post(
  "/userform/createFormDetails",
  verifyToken,
  authorize,
  createFormDetails
);
userFormRouter.put(
  "/userform/UpdateUserformDetail/:id",
  verifyToken,
  authorize,
  EditUserFormDetail
);
userFormRouter.get("/userform/getListForm", verifyToken, authorize, getListForm);
userFormRouter.put("/userform/:id", verifyToken, authorize, EditUserForm);
userFormRouter.patch("/userform/:id", verifyToken, authorize, approvedForm);

export default userFormRouter;
