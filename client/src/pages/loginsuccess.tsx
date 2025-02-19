import React from "react";
import authService from "../services/auth.service";
import "./LoginSuccess.scss";

const LoginSuccess: React.FC = () => {

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
