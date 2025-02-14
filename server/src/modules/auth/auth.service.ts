import { jwtDecode } from "jwt-decode";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class AuthService {
  private readonly OIDC_TOKEN_URL = "https://id2.tris.vn/connect/token";
  private readonly OIDC_USERINFO_URL = "https://id2.tris.vn/connect/userinfo";

  async verifyToken(access_token: string) {
    console.log("token: ", access_token);
    if (!access_token) {
      console.error("❌ Không có token được gửi lên!");
      throw new HttpException("Token không hợp lệ", HttpStatus.UNAUTHORIZED);
    }

    // ✅ Giải mã token mà không cần verify
    try {
      const decoded = jwtDecode(access_token);
      console.log("🔑 Token decoded:", decoded);
    } catch (error) {
      console.error("❌ Token không hợp lệ khi decode:", error);
      throw new HttpException("Token không hợp lệ", HttpStatus.UNAUTHORIZED);
    }

    // ✅ Gửi token lên OIDC server để kiểm tra tính hợp lệ
    try {
      const response = await axios.get(this.OIDC_USERINFO_URL, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      console.log("✅ Token hợp lệ! Thông tin user:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Token không hợp lệ hoặc đã hết hạn:",
        error.response?.data || error
      );

      throw new HttpException(
        "Token không hợp lệ hoặc đã hết hạn",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
