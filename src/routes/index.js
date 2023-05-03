const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const userRouter = require("./userRoute");
const formRouter = require("./formRoute");
const userFormRouter = require('./userFormRoute');
const userFormDetailRouter = require('./userFormDetailRoute');

const routers = express.Router();

routers.use(userRouter);
routers.use(authenticate, authorize, formRouter);
routers.use(authenticate, authorize, userFormRouter);
routers.use(authenticate, authorize, userFormDetailRouter);

module.exports = routers;