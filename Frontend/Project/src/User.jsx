import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Pencil,
  Power,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AwardIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const UserBody = () => {
  // ================= USER STATE =================

  const [users, setUsers] = useState([]);

  // ================= SEARCH =================

  const [search, setSearch] = useState("");

  // ================= MODAL =================

  const [modal, setModal] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  // ================= FORM =================

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });

  // ================= FORM HANDLER =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
    });
  };

  // ================= OPEN ADD =================

  const openAddModal = () => {
    resetForm();
    setSelectedUser(null);
    setModal("add");
  };

  // ================= OPEN EDIT =================

  const openEditModal = (user) => {
    setSelectedUser(user);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      status: user.status || "Active",
    });

    setModal("edit");
  };

  // ================= OPEN VIEW =================

  const openViewModal = (user) => {
    setSelectedUser(user);
    setModal("view");
  };

  // ================= OPEN STATUS =================

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setModal("status");
  };

  // ================= OPEN DELETE =================

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModal("delete");
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    resetForm();
  };

  // =====================================================
  // BACKEND FUNCTIONS
  // Yaha baad mein axios API calls laga dena
  // =====================================================

  const handleAddUser = async (e) => {
    try {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/admin/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Add User:", form);

      if (response.data.status) {
        setUsers((prev) => [response.data.user, ...prev]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditUser = async (e) => {
    try {
      e.preventDefault();

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/admin/update/${selectedUser._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id ? response.data.user : user,
          ),
        );
        toast.success(response.data.message);

        console.log("Edit User:", selectedUser, form);

        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/admin/getallUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setUsers(response.data.user);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedUser.status === "Active" ? "Inactive" : "Active";
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/admin/status/${selectedUser._id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id ? response.data.user : user,
          ),
        );
        toast.success(response.data.message);
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/admin/deleteUser/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== selectedUser._id),
        );

        toast.success(response.data.message);

        console.log("Delete User:", selectedUser);
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= SEARCH FILTER =================

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();

    return (
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.phone?.toLowerCase().includes(searchValue) ||
      user.address?.toLowerCase().includes(searchValue)
    );
  });

  // ================= COUNTS =================

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive",
  ).length;

  return (
    <>
      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <p className="text-sm text-slate-400 mb-1">Management</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Users
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage all users and their account status.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* THREE CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {/* Total */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalUsers}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Users size={22} className="text-indigo-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">All registered users</p>
        </div>

        {/* Active */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Users</p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {activeUsers}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
          </div>

          <p className="text-xs text-emerald-600 mt-5">Currently active</p>
        </div>

        {/* Inactive */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive Users
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inactiveUsers}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <XCircle size={22} className="text-rose-600" />
            </div>
          </div>

          <p className="text-xs text-rose-500 mt-5">Currently inactive</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
        <div className="relative flex gap-16">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users by name, email, phone or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-190 h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* USER TABLE */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">All Users</h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredUsers.length} users found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Email
                </th>

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Phone
                </th>

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Address
                </th>

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="hover:bg-slate-50 transition"
                  >
                    {/* User */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID: {user._id || user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </td>

                    {/* Phone */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{user.phone}</p>
                    </td>

                    {/* Address */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{user.address}</p>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      {user.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          title="View"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit"
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => openStatusModal(user)}
                          title="Status"
                          className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                        >
                          <Power size={15} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(user)}
                          title="Delete"
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
                  <td colSpan="6" className="py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Users size={24} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No users found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Users will appear here after they are added.
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
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  {modal === "add" ? (
                    <UserPlus size={19} className="text-indigo-600" />
                  ) : (
                    <Pencil size={19} className="text-indigo-600" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {modal === "add" ? "Add New User" : "Edit User"}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {modal === "add"
                      ? "Create a new user account"
                      : "Update user information"}
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
              onSubmit={modal === "add" ? handleAddUser : handleEditUser}
              className="p-6"
            >
              <div className="space-y-4">
                {/* Name */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Address */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows="3"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              {/* Buttons */}

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
                  {modal === "add" ? "Add User" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {modal === "view" && selectedUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">User Details</h3>

                <p className="text-xs text-slate-400 mt-1">
                  Complete user information
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
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold mb-3">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {selectedUser.name}
                </h3>

                <span
                  className={`mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedUser.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Mail size={17} className="text-indigo-600" />

                  <div>
                    <p className="text-[11px] text-slate-400">Email</p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Phone size={17} className="text-indigo-600" />

                  <div>
                    <p className="text-[11px] text-slate-400">Phone</p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <MapPin size={17} className="text-indigo-600" />

                  <div>
                    <p className="text-[11px] text-slate-400">Address</p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedUser.address}
                    </p>
                  </div>
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
      {/* STATUS MODAL */}
      {/* ================================================= */}

      {modal === "status" && selectedUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto">
              <Power size={22} className="text-amber-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Change User Status
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to{" "}
              <span className="font-semibold text-slate-700">
                {selectedUser.status === "Active" ? "Deactivated" : "activate"}
              </span>{" "}
              this user?
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
                Change Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {modal === "delete" && selectedUser && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto">
              <AlertTriangle size={22} className="text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Delete User
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedUser.name}
              </span>
              ?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteUser}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserBody;
