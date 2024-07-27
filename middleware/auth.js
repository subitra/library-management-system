const config = process.env; //;
const jwt = require("jsonwebtoken");
const User = require("../model/users");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, "secretKey");
    const userId = decoded.user_id;

    req.user = await User.findById(userId);

    //req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
module.exports = verifyToken;
