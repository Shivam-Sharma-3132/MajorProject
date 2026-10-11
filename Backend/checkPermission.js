const User = require("./models/user");

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(403).json({
          status: false,
          message: "Forbidden: No role assigned",
        });
      }

      // SUPER_ADMIN ke paas bypass access de sakte hain
      if (user.role.name === "SUPER_ADMIN") {
        return next();
      }

      const userPermissions = user.role.permissions || [];
      const hasPermission = userPermissions.includes(
        requiredPermission.toLowerCase(),
      );

      if (!hasPermission) {
        return res.status(403).json({
          status: false,
          message: `Access Denied: You do not have permission to perform '${requiredPermission}'`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Permission evaluation error",
      });
    }
  };
};

module.exports = checkPermission;
