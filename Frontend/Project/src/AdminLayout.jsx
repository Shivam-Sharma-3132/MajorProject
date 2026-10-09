import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Store,
  Boxes,
  Tags,
  GitBranch,
  Package,
  LifeBuoy,
  User,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        let token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/admin/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error("Invalid Token");
        }
      } catch (error) {
        console.log(error);
      }
    };

    verifyUser();
  }, [navigate]);

  const navigateUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* ================= HEADER ================= */}

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-white font-bold text-lg">S</span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">Synapto</h1>

              <p className="text-[11px] text-slate-400 hidden sm:block">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Profile */}

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">Admin User</p>

              <p className="text-xs text-slate-400">Administrator</p>
            </div>

            <button
              type="button"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-indigo-300 transition"
            >
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-3xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold shadow-md shadow-rose-200 transition"
              onClick={navigateUser}
            >
              LogOut
            </button>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        {/* Navigation */}

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
            Main Menu
          </p>

          <div className="space-y-1">
            {/* Dashboard */}

            <NavLink
              to="/dashboard"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Dashboard</span>
                </>
              )}
            </NavLink>

            {/* User */}

            <NavLink
              to="/user"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <User
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">User</span>
                </>
              )}
            </NavLink>

            {/* Store */}

            <NavLink
              to="/store"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <Store
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Store</span>
                </>
              )}
            </NavLink>

            {/* Inventory */}

            <NavLink
              to="/inventory"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <Boxes
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Inventory</span>
                </>
              )}
            </NavLink>

            {/* Category */}

            <NavLink
              to="/category"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <Tags
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Category</span>
                </>
              )}
            </NavLink>

            {/* Sub Category */}

            <NavLink
              to="/sub-category"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <GitBranch
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Sub Category</span>
                </>
              )}
            </NavLink>

            {/* Product */}

            <NavLink
              to="/product"
              className="group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  <Package
                    size={19}
                    className={isActive ? "text-indigo-600" : "text-slate-400"}
                  />

                  <span className="text-sm font-medium">Product</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Sidebar Bottom */}

        <div className="p-4 border-t border-slate-100">
          <div className="bg-indigo-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <LifeBuoy size={18} className="text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-indigo-900">
                  Need Help?
                </p>

                <p className="text-[11px] text-indigo-500">
                  We're here for you
                </p>
              </div>
            </div>

            <p className="text-xs text-indigo-600 mt-2">
              Contact your administrator for support.
            </p>

            <button
              type="button"
              className="mt-3 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="pt-16 lg:pl-64 min-h-screen flex flex-col">
        {/* Page Body */}

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>

        {/* ================= FOOTER ================= */}

        <footer className="border-t border-slate-200 bg-white">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              © 2026 Synapto. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <button
                type="button"
                className="hover:text-indigo-600 transition"
              >
                Privacy
              </button>

              <button
                type="button"
                className="hover:text-indigo-600 transition"
              >
                Terms
              </button>

              <button
                type="button"
                className="hover:text-indigo-600 transition"
              >
                Support
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
