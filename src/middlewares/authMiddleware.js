const { REGULAR_EXPRESSIONS } = require('../config/constants');
const { TOKEN_TYPE, HTTP_METHODS } = require('../config/constants');
const httpStatus = require('http-status');
const { AUTH_MESSAGES } = require('../constants/messages');
const config = require('../config/index');
const sequelize = require("../models/dbconfig");
const { User, Role, RoleModule } = sequelize.models;
const APIError = require('../helper/apiError');
const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(REGULAR_EXPRESSIONS.ONE_SPACE_ONLY)[0] === TOKEN_TYPE.BEARER) {
        return authHeader.split(REGULAR_EXPRESSIONS.ONE_SPACE_ONLY)[1];
    } else {
        return null;
    }
}

const authenticate = async (req, res, next) => {
    const token = getToken(req);
    if(!token) {
        return res.status(httpStatus.UNAUTHORIZED).json(AUTH_MESSAGES.NO_TOKEN);
    }

    jwt.verify(token, config.tokenSecret, async (error, decoded) => {
        if(error) {
            return res.status(httpStatus.UNAUTHORIZED).json(AUTH_MESSAGES.FAIL_AUTHENTICATE);
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
              case HTTP_METHODS.GET:
                if (roleModule.canRead) return next();
                break;
              case HTTP_METHODS.POST:
                if (roleModule.canWrite) return next();
                break;
              case HTTP_METHODS.PUT:
                if (roleModule.canUpdate) return next();
                break;
              case HTTP_METHODS.DELETE:
                if (roleModule.canDelete) return next();
                break;
            }
        }
    }

    return next(new APIError({ message: authMessage.AUTHORIZE_FORBIDDEN, status: httpStatus.FORBIDDEN }));
}

module.exports = { authenticate, authorize};