import React, { useEffect, useState } from "react";
import {
  Folder,
  Plus,
  Search,
  Eye,
  Pencil,
  Power,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const SubCategory = () => {
  // ================= SUB CATEGORY STATE =================

  const [categories, setCategories] = useState([]);

  // ================= SEARCH =================

  const [search, setSearch] = useState("");

  // ================= MODAL =================

  const [modal, setModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ================= IMAGE =================

  const [imagePreview, setImagePreview] = useState("");

  // ================= FORM =================

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: null,
    status: "Active",
    parentCategory: "",
  });

  // ================= FORM HANDLER =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE HANDLER =================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      description: "",
      image: null,
      status: "Active",
      parentCategory: "",
    });

    setImagePreview("");
  };

  // ================= OPEN ADD =================

  const openAddModal = () => {
    resetForm();
    setSelectedCategory(null);
    setModal("add");
  };

  // ================= OPEN EDIT =================

  const openEditModal = (category) => {
    setSelectedCategory(category);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: null,
      status: category.status || "Active",
      parentCategory:
        category.parentCategory?._id ||
        category.parentCategory ||
        category.category?._id ||
        category.category ||
        "",
    });

    setImagePreview(category.image || "");

    setModal("edit");
  };

  // ================= OPEN VIEW =================

  const openViewModal = (category) => {
    setSelectedCategory(category);
    setModal("view");
  };

  // ================= OPEN STATUS =================

  const openStatusModal = (category) => {
    setSelectedCategory(category);
    setModal("status");
  };

  // ================= OPEN DELETE =================

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setModal("delete");
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    setModal(null);
    setSelectedCategory(null);
    resetForm();
  };

  // =====================================================
  // BACKEND FUNCTIONS
  // =====================================================

  // ================= ADD SUB CATEGORY =================

  const handleAddCategory = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("status", form.status);
      formData.append("parentCategory", form.parentCategory);

      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await axios.post(
        "http://localhost:5000/category/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        setCategories((prev) => [...prev, response.data.category]);

        toast.success(
          response.data.message || "Sub-category added successfully",
        );

        closeModal();
      } else {
        toast.error(response.data.message || "Failed to add sub-category");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= EDIT SUB CATEGORY =================

  const handleEditCategory = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("status", form.status);
      formData.append("parentCategory", form.parentCategory);

      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await axios.put(
        `http://localhost:5000/category/update/${selectedCategory._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        setCategories((prev) =>
          prev.map((category) =>
            category._id === selectedCategory._id
              ? response.data.category
              : category,
          ),
        );

        toast.success(
          response.data.message || "Sub-category updated successfully",
        );

        closeModal();
      } else {
        toast.error(response.data.message || "Failed to update sub-category");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= GET SUB CATEGORIES =================

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/category/getallCategories",
      );

      if (response.data.status) {
        setCategories(response.data.category || []);
      } else {
        toast.error(response.data.message || "Failed to fetch sub-categories");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to fetch sub-categories",
      );
    }
  };

  // ================= GET DATA =================

  useEffect(() => {
    getCategories();
  }, []);

  // ================= STATUS CHANGE =================

  const handleStatusChange = async () => {
    try {
      const newStatus =
        selectedCategory.status === "Active" ? "Inactive" : "Active";

      const response = await axios.patch(
        `http://localhost:5000/category/status/${selectedCategory._id}`,
        {
          status: newStatus,
        },
      );

      if (response.data.status) {
        setCategories((prev) =>
          prev.map((category) =>
            category._id === selectedCategory._id
              ? response.data.category
              : category,
          ),
        );

        toast.success(response.data.message || "Status updated successfully");

        closeModal();
      } else {
        toast.error(response.data.message || "Failed to change status");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= DELETE SUB CATEGORY =================

  const handleDeleteCategory = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/category/deleteCategory/${selectedCategory._id}`,
      );

      if (response.data.status) {
        setCategories((prev) =>
          prev.filter((category) => category._id !== selectedCategory._id),
        );

        toast.success(
          response.data.message || "Sub-category deleted successfully",
        );

        closeModal();
      } else {
        toast.error(response.data.message || "Failed to delete sub-category");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // ================= SEARCH FILTER =================

  const filteredCategories = categories.filter((category) => {
    const searchValue = search.toLowerCase().trim();

    const parentCategoryName =
      category.parentCategory?.name ||
      category.parentCategory ||
      category.category?.name ||
      category.category ||
      "";

    return (
      category.name?.toLowerCase().includes(searchValue) ||
      parentCategoryName?.toString().toLowerCase().includes(searchValue) ||
      category.slug?.toLowerCase().includes(searchValue)
    );
  });

  // ================= COUNTS =================

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.status === "Active",
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "Inactive",
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
            Sub-Categories
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage all sub-categories and their status.
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
              <p className="text-sm font-medium text-slate-500">
                Total Sub-Categories
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {totalCategories}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Folder size={22} className="text-indigo-600" />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">All sub-categories</p>
        </div>

        {/* Active */}

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Sub-Categories
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {activeCategories}
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
                Inactive Sub-Categories
              </p>

              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {inactiveCategories}
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
        <div className="relative flex gap-11">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search sub-category, parent category or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-180 h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition"
          >
            <Plus size={18} />
            Add Sub-Category
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* SUB CATEGORY TABLE */}
      {/* ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">All Sub-Categories</h3>

          <p className="text-xs text-slate-400 mt-1">
            {filteredCategories.length} sub-categories found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {/* SUB CATEGORY */}

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Sub Category
                </th>

                {/* PARENT CATEGORY */}

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Parent Category
                </th>

                {/* SLUG */}

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Slug
                </th>

                {/* STATUS */}

                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                {/* ACTION */}

                <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                  const parentCategory =
                    category.parentCategory?.name ||
                    category.parentCategory ||
                    category.category?.name ||
                    category.category ||
                    "N/A";

                  return (
                    <tr
                      key={category._id}
                      className="hover:bg-slate-50 transition"
                    >
                      {/* SUB CATEGORY */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center text-indigo-600 font-bold shrink-0">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Folder size={19} />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {category.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: {category._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PARENT CATEGORY */}

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {parentCategory}
                        </p>
                      </td>

                      {/* SLUG */}

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600">
                          {category.slug || "N/A"}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        {category.status === "Active" ? (
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

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openViewModal(category)}
                            title="View"
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openEditModal(category)}
                            title="Edit"
                            className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => openStatusModal(category)}
                            title="Status"
                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition"
                          >
                            <Power size={15} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(category)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Folder size={24} className="text-slate-400" />
                      </div>

                      <p className="text-sm font-semibold text-slate-700">
                        No sub-categories found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Sub-categories will appear here after they are added.
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
          <div className="w-full max-w-lg h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto">
            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  {modal === "add" ? (
                    <Plus size={19} className="text-indigo-600" />
                  ) : (
                    <Pencil size={19} className="text-indigo-600" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {modal === "add"
                      ? "Add New Sub-Category"
                      : "Edit Sub-Category"}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {modal === "add"
                      ? "Create a new sub-category"
                      : "Update sub-category information"}
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

            {/* FORM */}

            <form
              onSubmit={
                modal === "add" ? handleAddCategory : handleEditCategory
              }
              className="p-4"
            >
              <div className="space-y-3">
                {/* Parent Category */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Parent Category
                  </label>

                  <input
                    type="text"
                    name="parentCategory"
                    value={form.parentCategory}
                    onChange={handleChange}
                    placeholder="Enter parent category ID"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Name */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sub-Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter sub-category name"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                {/* Slug */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Slug
                  </label>

                  <div className="relative">
                    <LinkIcon
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="sub-category-slug"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 outline-none text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                {/* Description */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>

                  <div className="relative">
                    <FileText
                      size={17}
                      className="absolute left-3 top-3 text-slate-400"
                    />

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter sub-category description"
                      rows="4"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none text-sm resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                {/* Image */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sub-Category Image
                  </label>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={24} className="text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={modal === "add"}
                          className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-semibold hover:file:bg-indigo-100"
                        />

                        <p className="text-xs text-slate-400 mt-2">
                          {modal === "edit"
                            ? "Leave empty to keep the existing image."
                            : "Select an image for this sub-category."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}

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
                  {modal === "add" ? "Add Sub-Category" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {modal === "view" && selectedCategory && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900">
                  Sub-Category Details
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Complete sub-category information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-indigo-50 overflow-hidden flex items-center justify-center mb-3">
                  {selectedCategory.image ? (
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Folder size={32} className="text-indigo-500" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {selectedCategory.name}
                </h3>

                <span
                  className={`mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                    selectedCategory.status === "Active"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {selectedCategory.status}
                </span>
              </div>

              <div className="space-y-3">
                {/* Parent Category */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Folder size={17} className="text-indigo-600" />

                  <div>
                    <p className="text-[11px] text-slate-400">
                      Parent Category
                    </p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedCategory.parentCategory?.name ||
                        selectedCategory.parentCategory ||
                        selectedCategory.category?.name ||
                        selectedCategory.category ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {/* Slug */}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <LinkIcon size={17} className="text-indigo-600" />

                  <div>
                    <p className="text-[11px] text-slate-400">Slug</p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedCategory.slug || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Description */}

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <FileText size={17} className="text-indigo-600 mt-0.5" />

                  <div>
                    <p className="text-[11px] text-slate-400">Description</p>

                    <p className="text-sm font-medium text-slate-700">
                      {selectedCategory.description || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Created At */}

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">Created At</p>

                  <p className="text-sm font-medium text-slate-700">
                    {selectedCategory.createdAt
                      ? new Date(selectedCategory.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                {/* Updated At */}

                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="text-[11px] text-slate-400">Updated At</p>

                  <p className="text-sm font-medium text-slate-700">
                    {selectedCategory.updatedAt
                      ? new Date(selectedCategory.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
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

      {modal === "status" && selectedCategory && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto">
              <Power size={22} className="text-amber-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Change Sub-Category Status
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to{" "}
              <span className="font-semibold text-slate-700">
                {selectedCategory.status === "Active"
                  ? "Deactivate"
                  : "activate"}
              </span>{" "}
              this sub-category?
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

      {modal === "delete" && selectedCategory && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto">
              <AlertTriangle size={22} className="text-rose-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mt-4">
              Delete Sub-Category
            </h3>

            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedCategory.name}
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
                onClick={handleDeleteCategory}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
              >
                Delete Sub-Category
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategory;
