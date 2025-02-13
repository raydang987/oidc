import axios from "axios";

const API_URL = "https://your-api.com/auth";

const authService = {
    async loginWithAccount(account: string, password: string) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                account,
                password,
            });

            if (response.data.success) {
                localStorage.setItem("access_token", response.data.token);
                return true;
            } else {
                throw new Error("Tài khoản hoặc mật khẩu không chính xác.");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            return false;
        }
    },
    async exchangeCodeForToken(code: string) {
        try {
            const response = await fetch("https://your-backend.com/api/auth/oidc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, redirect_uri: window.location.origin + "/callback" }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("token", data.token); // Lưu token vào localStorage
                return true;
            }

            throw new Error("Không lấy được token!");
        } catch (error) {
            console.error("Lỗi trao đổi mã:", error);
            throw error;
        }
    },
    loginWithOIDC() {
        setTimeout(() => {
            window.location.href = `https://id2.tris.vn/Account/Login?client_id=TrisDA.SPA&redirect_uri=${window.location.origin}/callback&response_type=code&scope=openid profile email`;
        }, 3000); // Chờ

    },

    async handleOIDCCallback(code: string) {
        try {
            const response = await axios.post(`${API_URL}/oidc-callback`, {
                code,
            });

            if (response.data.success) {
                localStorage.setItem("access_token", response.data.token);
                return true;
            } else {
                throw new Error("Lỗi xác thực OIDC.");
            }
        } catch (error) {
            console.error("Lỗi xử lý callback OIDC:", error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    },
};

export default authService;
