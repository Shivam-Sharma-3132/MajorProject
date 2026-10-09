const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Dummy")
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
