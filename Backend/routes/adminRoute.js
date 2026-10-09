const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const auth = require("../auth");
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

router.post("/add", auth, add);

router.put("/update/:id", auth, update);

router.get("/getallUsers", auth, getAll);

router.patch("/status/:id", auth, status);

router.post("/verify", auth, verify);

router.delete("/deleteUser/:id", auth, deleteUser);

module.exports = router;
