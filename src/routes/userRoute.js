const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post("/users/login", userController.login);
userRouter.post("/users", userController.createUser);

userRouter.get("/users", userController.getListUsers);
userRouter.get("/users/:id", userController.getUserDetail);

userRouter.put("/users/:id", userController.updateUser);
userRouter.delete("/users/:id", userController.deleteUser);

module.exports = userRouter;