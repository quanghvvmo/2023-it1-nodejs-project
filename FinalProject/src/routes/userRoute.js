import express from 'express';
import uploadFile from '../middleware/uploadFile'
import UserController from '../controller/userController'

const userRouter = express.Router();

userRouter.post("/user/create", uploadFile.upload.single('avatar'), UserController.createUser)
userRouter.put("/user/update", uploadFile.upload.single('avatar'), UserController.updateUser)
userRouter.patch("/user/soft-delete", UserController.handleLogin)
userRouter.post("/user/login", UserController.handleLogin)

module.exports = userRouter