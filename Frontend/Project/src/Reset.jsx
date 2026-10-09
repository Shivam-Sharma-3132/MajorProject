import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Reset = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const checkHandler = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newError = {};

    if (form.password === "") {
      newError.password = "Password is required";
    } else if (form.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    if (form.confirmPassword === "") {
      newError.confirmPassword = "Please confirm your password";
    }

    if (
      form.password !== "" &&
      form.confirmPassword !== "" &&
      form.password !== form.confirmPassword
    ) {
      newError.matchPassword = "Passwords do not match";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/reset", {
        email: email,
        password: form.password,
      });

      if (response.data.status) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl h-[calc(100vh-32px)] max-h-[600px] bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-14">
          <form onSubmit={submitHandler} className="w-full max-w-md">
            <div className="mb-7">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Create new password
              </h1>

              <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                Choose a strong password for your account
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                New Password
              </label>

              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={checkHandler}
                className={`w-full h-11 px-4 rounded-xl border outline-none transition ${
                  error.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />

              {error.password && (
                <p className="text-red-500 text-xs mt-1.5">{error.password}</p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={checkHandler}
                className={`w-full h-11 px-4 rounded-xl border outline-none transition ${
                  error.confirmPassword || error.matchPassword
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />

              {error.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {error.confirmPassword}
                </p>
              )}

              {error.matchPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {error.matchPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition shadow-md shadow-indigo-200"
            >
              Reset Password
            </button>
          </form>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85"
            alt="Laptop workspace"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-indigo-950/10" />
        </div>
      </div>
    </div>
  );
};

export default Reset;
