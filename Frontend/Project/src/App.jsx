import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Signup from "./Signup";
import Login from "./Login";
import Forget from "./Forget";
import Dashboard from "./Dashboard";
import Otp from "./Otp";
import Reset from "./Reset";
import User from "./User";
import AdminLayout from "./AdminLayout";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Roles from "./Roles";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/forget" element={<Forget />} />

        <Route path="/otp" element={<Otp />} />
        <Route path="/reset" element={<Reset />} />
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/category" element={<Category />} />
          <Route path="/sub-category" element={<SubCategory />} />
          <Route path="/role" element={<Roles />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
};

export default App;
