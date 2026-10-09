const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.send({ status: false, message: "Token not found" });
    }

    let token = authHeader.split(" ")[1];

    if (!token) {
      return res.send({ status: false, message: "Token Missing" });
    }

    let decodeToken = await jwt.verify(token, "MySecretKey");

    if (!decodeToken) {
      res.send({ status: false, message: "Invalid Token" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = auth;
