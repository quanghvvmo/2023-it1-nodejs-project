const express = require('express');
const userRouter = require("./userRoute");
const customerRouter = require('./customerRoute');
const orderRouter = require('./orderRoute');
const productRouter = require('./productRoute');

const routers = express.Router();

routers.use(userRouter);
routers.use(customerRouter);
routers.use(orderRouter);
routers.use(productRouter);

module.exports = routers;