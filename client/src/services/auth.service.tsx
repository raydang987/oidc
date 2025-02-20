import axios from "axios";

const API_URL = "https://localhost:3001/auth";
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
    }, async exchangeCodeForToken(code: string) {
        try {
            console.log("🔄 Đang trao đổi mã lấy access token...");

            let codeVerifier = "";
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("oidc.")) {
                    const data = JSON.parse(localStorage.getItem(key) || "{}");
                    if (data.code_verifier) {
                        codeVerifier = data.code_verifier;
                        break;
                    }
                }
            }

            console.log("📝 Code Verifier lấy được:", codeVerifier);

            if (!codeVerifier) throw new Error("Không tìm thấy code_verifier!");

            const response = await axios.post(
                `https://id2.tris.vn/connect/token`,
                new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: window.location.origin + "/callback",
                    client_id: "oidcId",
                    code_verifier: codeVerifier,
                    scope: "openid profile email",
                }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            if (response.data.access_token) {
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("authority", "https://id2.tris.vn");
                localStorage.setItem("client_id", "oidcId");
                localStorage.setItem("redirect_uri", window.location.origin + "/callback");
                localStorage.setItem("scope", "openid profile email");

                console.log("✅ Access Token nhận được:", response.data.access_token);

                const userInfo = await authService.verifyToken(response.data.access_token);

                return userInfo;
            }

            throw new Error(response.data.error_description || "Không lấy được token!");
        } catch (error) {
            console.error("❌ Lỗi trao đổi mã:", error);
            throw error;
        }
    }
    ,
    async verifyToken(token: string) {
        try {
            console.log("🔍 Gửi access_token xuống Backend để xác thực...");

            const response = await axios.post(

                `http://localhost:3001/api/auth/verify-token`,
                { access_token: token },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Token hợp lệ! Thông tin user từ BE:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Token không hợp lệ hoặc đã hết hạn:", error);
            throw error;
        }
    },
    async loginWithOIDC() {
        try {
            await userManager.signinRedirect();
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
            await userManager.signoutRedirect({ id_token_hint: (await userManager.getUser())?.access_token }); // Điều hướng đến trang đăng xuất OIDC
            // Xóa tất cả dữ liệu cục bộ
            localStorage.clear();
            sessionStorage.clear();

            // Xóa toàn bộ cookies của trang hiện tại
            document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
            });

        } catch (error) {
            console.error("Lỗi đăng xuất OIDC:", error);
        }
    },
    async getUser() {
        return await userManager.getUser(); // Lấy thông tin người dùng hiện tại
    },
    async register(userData: { account: string; email: string; password: string }) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json(); // Lấy dữ liệu phản hồi từ server

            if (!response.ok) {
                throw new Error(data.message || "Đăng ký thất bại!");
            }

            return data; // Trả về dữ liệu từ server nếu đăng ký thành công
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error.message);
            throw new Error(error.message || "Lỗi hệ thống! Vui lòng thử lại.");
        }
    },
};

export default authService;