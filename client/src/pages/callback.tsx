import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import "./Callback.scss"; // Import file SCSS

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOIDCResponse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      console.log("OIDC Redirect Code:", code); // Kiểm tra code có tồn tại không
      if (code) {
        try {
          navigate("/login-success");
          await authService.exchangeCodeForToken(code);
        } catch (error) {
          console.error("Lỗi xử lý OIDC:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleOIDCResponse();
  }, [navigate]);

  return (
    <div className="loading-screen">
      <h2>Đang xử lý đăng nhập...</h2>
      <p>Vui lòng đợi giây lát...</p>
      <div className="spinner"></div> {/* Thêm vòng quay */}
    </div>
  );
};

export default Callback;
