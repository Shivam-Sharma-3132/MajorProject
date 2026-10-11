const express = require("express");
const auth = require("../auth");
const checkPermission = require("../checkPermission");
const {
  addRole,
  updateRole,
  getallRoles,
  statusRole,
  deleteRole,
} = require("../controllers/rolesController");

const router = express.Router();

router.post("/addRole", auth, checkPermission("roles_add"), addRole);
router.put(
  "/updateRole/:id",
  auth,
  checkPermission("roles_update"),
  updateRole,
);
router.get("/getallRoles", auth, checkPermission("roles_read"), getallRoles);
router.patch(
  "/statusRole/:id",
  auth,
  checkPermission("roles_update"),
  statusRole,
);
router.delete(
  "/deleteRole/:id",
  auth,
  checkPermission("roles_delete"),
  deleteRole,
);

module.exports = router;
