import jwt from "jsonwebtoken";
function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
  return token;
}

export default generateToken;
