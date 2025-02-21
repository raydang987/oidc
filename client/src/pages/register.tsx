import React, { useState } from "react";
import authService from "../services/auth.service";
import "./register.scss";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [username, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
        setError("Mật khẩu và xác nhận mật khẩu không khớp!");
        return;
    }

    setLoading(true);
    try {
        const success = await authService.register({ username, email, password });
        localStorage.setItem('username',success.data.username)
        if (success) {

            alert("Đăng ký thành công! ");
           navigate('/login-success')
        } else {
            setError("Đăng ký không thành công. Vui lòng thử lại!");
        }
    } catch (err: any) {
        setError(err?.response?.data?.message || "Lỗi hệ thống! Vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
};


  return (
    <form onSubmit={handleRegister} className="register-form">
      <h2 className="register-form__title">Đăng ký</h2>

      {error && <p className="register-form__error">{error}</p>}

      <div className="register-form__group">
        <label>Tài khoản</label>
        <input type="text" value={username} onChange={(e) => setAccount(e.target.value)} required />
      </div>

      <div className="register-form__group">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="register-form__group">
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="register-form__group">
        <label>Xác nhận mật khẩu</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>

      <button type="submit" className="register-form__button" disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <p className="register-form__login-link">
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </p>
    </form>
  );
};

export default RegisterForm;
