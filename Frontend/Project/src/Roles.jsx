import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Eye,
  Pencil,
  Power,
  Trash2,
  X,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// Schema enum values
const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "ADMIN",
  "STORE_MANAGER",
  "INVENTORY_MANAGER",
  "DELIVERY_PARTNER",
  "SUPPORT_AGENT",
  "CUSTOMER",
];

// Modules aur unke actions jo checkboxes banayenge
const MODULES = [
  { key: "users", label: "Users" },
  { key: "category", label: "Category" },
  { key: "subcategory", label: "SubCategory" },
];

const ACTIONS = [
  { key: "add", label: "Add" },
  { key: "read", label: "Read" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
];

const Roles = () => {
  // ================= STATE =================
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'view' | 'status' | 'delete'
  const [selectedRole, setSelectedRole] = useState(null);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    name: "",
    permissions: [],
    status: "ACTIVE",
  });

  // ================= RESET FORM =================
  const resetForm = () => {
    setForm({
      name: "",
      permissions: [],
      status: "ACTIVE",
    });
  };

  // ================= PERMISSION HANDLERS =================
  const handlePermissionToggle = (moduleKey, actionKey) => {
    const permissionKey = `${moduleKey}_${actionKey}`.toLowerCase();

    setForm((prev) => {
      const exists = prev.permissions.includes(permissionKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permissionKey)
          : [...prev.permissions, permissionKey],
      };
    });
  };

  const handleSelectAllModulePermissions = (moduleKey) => {
    const modulePerms = ACTIONS.map((a) =>
      `${moduleKey}_${a.key}`.toLowerCase(),
    );
    const allSelected = modulePerms.every((p) => form.permissions.includes(p));

    setForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !modulePerms.includes(p))
        : Array.from(new Set([...prev.permissions, ...modulePerms])),
    }));
  };

  // ================= MODAL CONTROLS =================
  const openAddModal = () => {
    resetForm();
    setSelectedRole(null);
    setModal("add");
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setForm({
      name: role.name || "",
      permissions: role.permissions || [],
      status: role.status || "ACTIVE",
    });
    setModal("edit");
  };

  const openViewModal = (role) => {
    setSelectedRole(role);
    setModal("view");
  };

  const openStatusModal = (role) => {
    setSelectedRole(role);
    setModal("status");
  };

  const openDeleteModal = (role) => {
    setSelectedRole(role);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedRole(null);
    resetForm();
  };

  // ================= API CALLS =================
  const getRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/roles/getallRoles",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setRoles(response.data.roles || response.data.role || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/roles/addRole",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setRoles((prev) => [response.data.role, ...prev]);
        toast.success(response.data.message || "Role created successfully");
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create role");
    }
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/roles/updateRole/${selectedRole._id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setRoles((prev) =>
          prev.map((role) =>
            role._id === selectedRole._id ? response.data.role : role,
          ),
        );
        toast.success(response.data.message || "Role updated successfully");
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedRole.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/roles/statusRole/${selectedRole._id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setRoles((prev) =>
          prev.map((role) =>
            role._id === selectedRole._id
              ? { ...role, status: newStatus }
              : role,
          ),
        );
        toast.success(response.data.message || "Status updated");
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change status");
    }
  };

  const handleDeleteRole = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/roles/deleteRole/${selectedRole._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.status) {
        setRoles((prev) =>
          prev.filter((role) => role._id !== selectedRole._id),
        );
        toast.success(response.data.message || "Role deleted");
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  };

  // ================= FILTERS & STATS =================
  const filteredRoles = roles.filter((role) => {
    const q = search.toLowerCase().trim();
    return (
      role.name?.toLowerCase().includes(q) ||
      role.status?.toLowerCase().includes(q)
    );
  });

  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.status === "ACTIVE").length;
  const inactiveRoles = roles.filter((r) => r.status === "INACTIVE").length;

  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <p className="text-sm text-slate-400 mb-1">Access Control</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Roles & Permissions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Define system roles and their module-level CRUD permissions.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Roles</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalRoles}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ShieldCheck size={22} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-5">All configured roles</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Roles</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {activeRoles}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-5">Currently in use</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive Roles
              </p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inactiveRoles}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <XCircle size={22} className="text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-rose-500 mt-5">Disabled roles</p>
        </div>
      </div>

      {/* SEARCH & ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search roles by name or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition whitespace-nowrap"
          >
            <Plus size={18} />
            Add Role
          </button>
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">All Roles</h3>
          <p className="text-xs text-slate-400 mt-1">
            {filteredRoles.length} roles found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Role Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Permissions Assigned
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <tr
                    key={role._id || role.id}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* Role Info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          <Lock size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {role.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {role._id || role.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Permissions summary */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-md">
                        {role.permissions?.length > 0 ? (
                          <>
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              {role.permissions.length} total rights
                            </span>
                            {role.permissions.slice(0, 3).map((perm) => (
                              <span
                                key={perm}
                                className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[11px] font-mono"
                              >
                                {perm}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="text-xs text-slate-400">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            No permissions assigned
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {role.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          INACTIVE
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(role)}
                          title="View Details"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEditModal(role)}
                          title="Edit Permissions"
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => openStatusModal(role)}
                          title="Toggle Status"
                          className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                        >
                          <Power size={15} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(role)}
                          title="Delete Role"
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <ShieldAlert size={24} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        No roles found
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Create a new role using the "Add Role" button above.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL (PERMISSION CHECKBOX MATRIX) */}
      {/* ================================================= */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {modal === "add"
                      ? "Create New Role"
                      : "Edit Role Permissions"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select role name and assign CRUD permissions across modules
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={modal === "add" ? handleAddRole : handleEditRole}
              className="p-6"
            >
              <div className="space-y-5">
                {/* Role Name Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role Name <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="">Choose a defined role</option>
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-4">
                    {["ACTIVE", "INACTIVE"].map((st) => (
                      <label
                        key={st}
                        className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="status"
                          value={st}
                          checked={form.status === st}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                          className="accent-indigo-600"
                        />
                        {st}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Permissions Matrix */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Module Permissions
                    </label>
                    <span className="text-xs text-slate-400">
                      Check permissions to grant access
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {/* Header Row */}
                    <div className="grid grid-cols-5 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <div className="col-span-1">Module</div>
                      {ACTIONS.map((action) => (
                        <div key={action.key} className="text-center">
                          {action.label}
                        </div>
                      ))}
                    </div>

                    {/* Module Rows */}
                    {MODULES.map((module) => {
                      const modulePerms = ACTIONS.map((a) =>
                        `${module.key}_${a.key}`.toLowerCase(),
                      );
                      const isAllChecked = modulePerms.every((p) =>
                        form.permissions.includes(p),
                      );

                      return (
                        <div
                          key={module.key}
                          className="grid grid-cols-5 px-4 py-3.5 items-center hover:bg-slate-50/60 transition"
                        >
                          <div className="col-span-1 flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">
                              {module.label}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleSelectAllModulePermissions(module.key)
                              }
                              className="text-[11px] text-indigo-600 hover:underline text-left mt-0.5"
                            >
                              {isAllChecked ? "Deselect All" : "Select All"}
                            </button>
                          </div>

                          {ACTIONS.map((action) => {
                            const pKey =
                              `${module.key}_${action.key}`.toLowerCase();
                            const checked = form.permissions.includes(pKey);

                            return (
                              <div
                                key={action.key}
                                className="flex justify-center items-center"
                              >
                                <input
                                  type="checkbox"
                                  id={pKey}
                                  checked={checked}
                                  onChange={() =>
                                    handlePermissionToggle(
                                      module.key,
                                      action.key,
                                    )
                                  }
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200"
                >
                  {modal === "add" ? "Save Role" : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}
      {modal === "view" && selectedRole && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">Role Details</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Assigned permissions breakdown
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Lock size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedRole.name}
                </h3>
                <span
                  className={`mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedRole.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedRole.status}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Granted Rights ({selectedRole.permissions?.length || 0})
                </p>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                  {selectedRole.permissions?.length > 0 ? (
                    selectedRole.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-medium"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">
                      No permissions granted.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-full mt-6 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* STATUS TOGGLE MODAL */}
      {/* ================================================= */}
      {modal === "status" && selectedRole && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto">
              <Power size={22} className="text-amber-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Change Role Status
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to{" "}
              <span className="font-semibold text-slate-700">
                {selectedRole.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </span>{" "}
              role <b>{selectedRole.name}</b>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}
      {modal === "delete" && selectedRole && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto">
              <AlertTriangle size={22} className="text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Delete Role
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to delete role{" "}
              <span className="font-semibold text-slate-700">
                {selectedRole.name}
              </span>
              ? Users assigned this role may lose access permissions.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Roles;
