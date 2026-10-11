const Role = require("../models/role");

// 1. ADD ROLE
const addRole = async (req, res) => {
  try {
    const { name, permissions, status } = req.body;

    if (!name) {
      return res.status(400).send({
        status: false,
        message: "Role name is required",
      });
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(409).send({
        status: false,
        message: "This role already exists",
      });
    }

    const newRole = await Role.create({
      name,
      permissions: permissions || [],
      status: status || "ACTIVE",
    });

    return res.status(201).send({
      status: true,
      message: "Role Created Successfully",
      role: newRole,
    });
  } catch (error) {
    console.error("Add Role Error:", error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 2. UPDATE ROLE
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions, status } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).send({
        status: false,
        message: "Role not found",
      });
    }

    // Agar role ka naam change ho raha ho toh duplicate check karein
    if (name && name !== role.name) {
      const existingName = await Role.findOne({ name });
      if (existingName) {
        return res.status(409).send({
          status: false,
          message: "Another role with this name already exists",
        });
      }
      role.name = name;
    }

    if (permissions !== undefined) {
      role.permissions = permissions;
    }

    if (status) {
      role.status = status;
    }

    await role.save();

    return res.status(200).send({
      status: true,
      message: "Role Updated Successfully",
      role,
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 3. GET ALL ROLES
const getallRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });

    return res.status(200).send({
      status: true,
      message: "Roles Fetched Successfully",
      roles,
    });
  } catch (error) {
    console.error("Get Roles Error:", error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 4. TOGGLE STATUS
const statusRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).send({
        status: false,
        message: "Invalid Role ID",
      });
    }

    role.status = status;
    await role.save();

    return res.status(200).send({
      status: true,
      message: "Status Updated Successfully",
      role,
    });
  } catch (error) {
    console.error("Status Update Error:", error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// 5. DELETE ROLE
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(404).send({
        status: false,
        message: "Role not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Role Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Role Error:", error);
    return res.status(500).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  addRole,
  updateRole,
  getallRoles,
  statusRole,
  deleteRole,
};
