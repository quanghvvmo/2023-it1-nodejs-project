import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(/\s+/)[1];
  if (token) {
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json("Invalid token");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("unauthenticated");
  }
};
export default verifyToken;
