const regularExpressions = require('../_utils/regularExpressions');
const httpStatus = require('http-status');
const authMessage = require('../constants/messages/auth');
const config = require('../config/index');
const sequelize = require("../models/dbconfig");
const { User, Role, RoleModule } = sequelize.models;
const APIError = require('../helper/apiError');
const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(regularExpressions.ONE_SPACE_ONLY)[0] === 'Bearer') {
        return authHeader.split(regularExpressions.ONE_SPACE_ONLY)[1];
    } else {
        return null;
    }
}

const authenticate = async (req, res, next) => {
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
            include: [Role],
            where: { id: userId },
        });
        req.user = user;
        return next()
    })
}

const authorize = async (req, res, next) => {
    const { user } = req;
    if(!user) {
        return next(new APIError({ message: authMessage.NOT_LOGGED_IN, status: httpStatus.UNAUTHORIZED}));
    }
    const { path } = req._parsedUrl;
    const api = path.substring(0, path.lastIndexOf("/"));
    const { method } = req;

    for(const role in user.Roles) {
        const RoleId = role.id;
        const roleModule = await RoleModule.findOne({ where: { api, RoleId } });

        if (roleModule) {
            switch (method) {
              case "GET":
                if (roleModule.canRead) return next();
                break;
              case "POST":
                if (roleModule.canWrite) return next();
                break;
              case "PUT":
                if (roleModule.canUpdate) return next();
                break;
              case "DELETE":
                if (roleModule.canDelete) return next();
                break;
            }
        }
    }

    return next(new APIError({ message: authMessage.AUTHORIZE_FORBIDDEN, status: httpStatus.FORBIDDEN }));
}

module.exports = { authenticate, authorize};