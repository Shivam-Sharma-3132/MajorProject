const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    otp: Number,
    phone: String,
    address: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

let User = mongoose.model("User", userSchema);

module.exports = User;
