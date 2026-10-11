const jwt = require("jsonwebtoken");
const User = require("./models/user");

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

    const user = await User.findById(decodeToken.id).populate("role");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.status === "Inactive") {
      return res
        .status(403)
        .json({ status: false, message: "Account is inactive" });
    }
    req.user = user;
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
