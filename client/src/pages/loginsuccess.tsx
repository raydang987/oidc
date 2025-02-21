import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import "./LoginSuccess.scss";

const LoginSuccess: React.FC = () => {
  const [subId, setSubId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubId = async () => {
      const username = localStorage.getItem("username");

      if (!username) {
        alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        const sub_id = await authService.getSubId(username);
        setSubId(sub_id);
      } catch (error) {
        console.error("Lỗi khi lấy sub_id:", error);
      }
    };

    fetchSubId();
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const handleSyncWithTris = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
      return;
    }

    await authService.syncWithTris(username);
  };

  return (
    <div className="login-success">
      <h2>Đăng nhập thành công!</h2>
      {subId === null && (
        <button onClick={handleSyncWithTris} className="sync-button">
          Đồng bộ tài khoản với TRIS
        </button>
      )}
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default LoginSuccess;
