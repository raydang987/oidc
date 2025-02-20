import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import "./index.css";
import LoginSuccess from "./pages/loginsuccess";
import Callback from "./pages/callback";
import RegisterForm from "./pages/register";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} /> {/* Xử lý mã xác thực */}
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
