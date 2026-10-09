import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Forget = () => {
  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

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

    if (form.email.trim() === "") {
      newError.email = "Email is required";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/forget",
        form,
      );

      if (response.data.status) {
        toast.success(response.data.message);
        navigate("/otp", {
          state: {
            email: form.email,
          },
        });
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
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition"
              >
                ← Back to login
              </Link>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Forgot password?
              </h1>

              <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                No worries. Enter your email address and we'll send you an OTP
                to reset your password.
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={checkHandler}
                className={`w-full h-11 px-4 rounded-xl border outline-none transition ${
                  error.email
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />

              {error.email && (
                <p className="text-red-500 text-xs mt-1.5">{error.email}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition shadow-md shadow-indigo-200"
            >
              Send OTP
            </button>
          </form>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85"
            alt="Workspace"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-indigo-950/10" />
        </div>
      </div>
    </div>
  );
};

export default Forget;
