import jwt from "jsonwebtoken"
require("dotenv").config();
import User from "../_database/models/user"
import UserRole from "../_database/models/userRole"
import Role from "../_database/models/role"

const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
        return req.headers.authorization.split(/\s+/)[1];
    }
    return ""
}
const authJWT = async (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(403).json("No token provided!")
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).json("Failed to authenticate token!")
        } else {
            const userId = decoded.userId;
            const user = await User.findAll({
                where: {
                    id: userId
                },
                include: [
                    {
                        model: UserRole,
                        include: [
                            {
                                model: Role,
                                as: "roleData",
                                attributes: ["name"],
                            },
                        ],
                        attributes: ["userid", "roleid"],
                        as: "userRole"
                    },
                ],
                raw: true,
                nest: true
            })
            req.user = user;
            return next();
        }
    })
}

module.exports = { authJWT: authJWT }