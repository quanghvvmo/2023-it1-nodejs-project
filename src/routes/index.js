const express = require('express');
const userRouter = require("./userRoute");

const routers = express.Router();

routers.use(userRouter);

module.exports = routers;