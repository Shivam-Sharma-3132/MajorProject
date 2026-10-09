import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Otp = () => {
  const [form, setForm] = useState({
    otp: "",
  });

  const [error, setError] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const checkHandler = (e) => {
    const { name, value } = e.target;

    if (value.length > 6) {
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const newError = {};

    if (form.otp === "") {
      newError.otp = "OTP is required";
    } else if (form.otp.length !== 6) {
      newError.otp = "OTP must be 6 digits";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/admin/otp", {
        email: email,
        otp: Number(form.otp),
      });

      if (res.data.status) {
        toast.success(res.data.message);
        navigate("/reset", {
          state: {
            email: email,
          },
        });
      } else {
        toast.error(res.data.message);
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
                Verify OTP
              </h1>

              <p className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed">
                We've sent a 6-digit verification code to{" "}
                <span className="font-semibold text-slate-700">
                  {email || "your email"}
                </span>
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                name="otp"
                id="otp"
                maxLength="6"
                placeholder="000000"
                value={form.otp}
                onChange={checkHandler}
                className={`w-full h-14 px-4 rounded-xl border text-center text-2xl tracking-[0.5em] font-bold outline-none transition ${
                  error.otp
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />

              {error.otp && (
                <p className="text-red-500 text-xs mt-1.5">{error.otp}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition shadow-md shadow-indigo-200"
            >
              Verify OTP
            </button>

            <p className="text-center text-sm text-slate-400 mt-5">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Resend
              </button>
            </p>
          </form>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85"
            alt="Team working together"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-indigo-950/10" />
        </div>
      </div>
    </div>
  );
};

export default Otp;
