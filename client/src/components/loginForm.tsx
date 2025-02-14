import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import "./LoginForm.scss";

const LoginForm: React.FC = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await authService.loginWithAccount(account, password);
      if (success) {
        alert("Đăng nhập thành công!");
        window.location.href = "/dashboard";
      } else {
        setError("Tài khoản hoặc mật khẩu không chính xác.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lỗi hệ thống! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrisLogin = () => {
    authService.loginWithOIDC();
  };

  useEffect(() => {
    const handleCallback = async () => {
      if (window.location.pathname === "/callback") {
        await authService.handleOIDCCallback();
      }
    };
    handleCallback();
  }, []);

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2 className="login-form__title">Đăng nhập</h2>

      {error && <p className="login-form__error">{error}</p>}

      <div className="login-form__group">
        <label>Tài khoản</label>
        <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} required />
      </div>

      <div className="login-form__group">
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit" className="login-form__button login-form__button--primary" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <button type="button" onClick={handleTrisLogin} className="login-form__button login-form__button--secondary">
        Đăng nhập qua Tris
      </button>
    </form>
  );
};

export default LoginForm;
