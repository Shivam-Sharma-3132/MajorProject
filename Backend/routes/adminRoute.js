const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const auth = require("../auth");
const checkPermission = require("../checkPermission");
const {
  signup,
  login,
  forget,
  otp,
  reset,
  add,
  update,
  getAll,
  status,
  deleteUser,
  verify,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forget", forget);

router.post("/otp", otp);

router.post("/reset", reset);

// USER ADD USING ADMINLAYOUT

router.post("/add", auth, checkPermission("users_add"), add);

router.put("/update/:id", auth, checkPermission("users_update"), update);

router.get("/getallUsers", auth, checkPermission("users_read"), getAll);

router.patch("/status/:id", auth, checkPermission("users_update"), status);

router.post("/verify", auth, verify);

router.delete(
  "/deleteUser/:id",
  auth,
  checkPermission("users_delete"),
  deleteUser,
);

module.exports = router;
