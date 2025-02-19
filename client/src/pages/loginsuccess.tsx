import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import "./LoginSuccess.scss"; // Import file CSS nếu có

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="login-success">
      <h2>Đăng nhập thành công!</h2>
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default LoginSuccess;
