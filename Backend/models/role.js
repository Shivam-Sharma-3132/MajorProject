const mongoose = require("mongoose");

let roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "STORE_MANAGER",
        "INVENTORY_MANAGER",
        "DELIVERY_PARTNER",
        "SUPPORT_AGENT",
        "CUSTOMER",
      ],
    },
    permissions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

let Role = mongoose.model("Role", roleSchema);

module.exports = Role;
