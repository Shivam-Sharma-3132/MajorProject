const express = require("express");
const {
  addRole,
  updateRole,
  getallRoles,
  statusRole,
  deleteRole,
} = require("../controllers/rolesController");

// Agar token verification middleware ho toh use import karke routes me pass kar sakte hain
// const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/addRole", addRole);
router.put("/updateRole/:id", updateRole);
router.get("/getallRoles", getallRoles);
router.patch("/statusRole/:id", statusRole);
router.delete("/deleteRole/:id", deleteRole);

module.exports = router;
