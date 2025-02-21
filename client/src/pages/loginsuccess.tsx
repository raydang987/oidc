import React from "react";
import authService from "../services/auth.service";
import "./LoginSuccess.scss";

const LoginSuccess: React.FC = () => {

  const handleLogout = () => {
    authService.logout();
  };
  const handleSyncWithTris = async () => {
    const username = localStorage.getItem('username');

    if (!username) {
        alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
        return;
    }

    await authService.syncWithTris(username);
};

  return (
    <div className="login-success">
      <h2>Đăng nhập thành công!</h2>
      <button onClick={handleSyncWithTris} className="logout-button">
       Đồng bộ tài khoản với TRIS
      </button>
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default LoginSuccess;
