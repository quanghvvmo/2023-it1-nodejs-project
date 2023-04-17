import express from 'express';
import userRouter from './userRoute'

const routers = express.Router();
routers.use(userRouter);

module.exports = routers;