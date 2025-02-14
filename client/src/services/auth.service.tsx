import axios from "axios";

const API_URL = "https://localhost/auth";
import { userManager } from "../config/oidcConfig";
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
    async loginWithOIDC() {
        try {
            await userManager.signinRedirect(); // Điều hướng đến trang đăng nhập OIDC
        } catch (error) {
            console.error("Lỗi đăng nhập OIDC:", error);
        }
    },
    async handleOIDCCallback() {
        try {
            const user = await userManager.signinRedirectCallback(); // Xử lý callback sau khi login
            if (user && user.access_token) {
                localStorage.setItem("access_token", user.access_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi xử lý callback OIDC:", error);
            return false;
        }
    },


    async logout() {
        try {
            await userManager.signoutRedirect(); // Điều hướng đến trang đăng xuất OIDC
            localStorage.removeItem("access_token");
        } catch (error) {
            console.error("Lỗi đăng xuất OIDC:", error);
        }
    },
    async getUser() {
        return await userManager.getUser(); // Lấy thông tin người dùng hiện tại
    },
};

export default authService;