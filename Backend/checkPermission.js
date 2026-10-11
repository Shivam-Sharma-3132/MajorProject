const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      const role = user?.role;

      if (!role || role.status === "INACTIVE") {
        return res.status(403).json({
          status: false,
          message: "Forbidden: No active role assigned",
        });
      }

      if (role.name === "SUPER_ADMIN") {
        return next();
      }

      const userPermissions = (role.permissions || []).map((permission) =>
        String(permission).toLowerCase(),
      );
      const requiredPermissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];
      const hasPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(String(permission).toLowerCase()),
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
