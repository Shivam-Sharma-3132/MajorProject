require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const auth = require("./auth");
const mongoose = require("./db/db");
// const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategoryRoute");
const rolescateoryRoutes = require("./routes/rolesRoute");
const fileupload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  }),
);

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});

// app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategory", subcategoryRoutes);
app.use("/roles", rolescateoryRoutes);

app.listen(5000, () => {
  console.log("Server Running");
});
