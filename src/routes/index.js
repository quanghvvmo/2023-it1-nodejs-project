const express = require('express');
const userRouter = require("./userRoute");
const formRouter = require("./formRoute");

const routers = express.Router();

routers.use(userRouter);
routers.use(formRouter);

module.exports = routers;