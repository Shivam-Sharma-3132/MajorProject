const jwt = require("jsonwebtoken");
const User = require("./models/user");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: false, message: "Token not found" });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({ status: false, message: "Token missing" });
    }

    const decodeToken = jwt.verify(token, "MySecretKey");
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
