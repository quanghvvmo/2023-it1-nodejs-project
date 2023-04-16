const regularExpressions = require('../_utils/regularExpressions');
const httpStatus = require('http-status');
const authMessage = require('../constants/authMessage');
const config = require('../config/index');
const sequelize = require("../models/dbconfig");
const { User, Customer } = sequelize.models;
const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(regularExpressions.ONE_SPACE_ONLY)[0] === 'Bearer') {
        return authHeader.split(regularExpressions.ONE_SPACE_ONLY)[1];
    } else {
        return null;
    }
}

const authMiddleware = async (req, res, next) => {
    const token = getToken(req);
    if(!token) {
        return res.status(httpStatus.UNAUTHORIZED).json(authMessage.NO_TOKEN);
    }

    jwt.verify(token, config.token_secret, async (error, decoded) => {
        if(error) {
            return res.status(httpStatus.UNAUTHORIZED).json(authMessage.FAIL_AUTHENTICATE);
        }
        const userId = decoded.id;
        const user = await User.findOne({
            include: [Customer],
            where: { id: userId },
        });
        req.user = user;
        return next()
    })
}

module.exports = authMiddleware;