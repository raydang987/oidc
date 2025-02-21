import { User } from "./../user/entity/user.entity";
import { jwtDecode } from "jwt-decode";
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from "@nestjs/common";
import axios from "axios";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  private readonly OIDC_TOKEN_URL = "https://id2.tris.vn/connect/token";
  private readonly OIDC_USERINFO_URL = "https://id2.tris.vn/connect/userinfo";
  private readonly API_URL = "https://id2.tris.vn";
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  async verifyToken(access_token: string) {
    console.log("token: ", access_token);
    if (!access_token) {
      console.error("❌ Không có token được gửi lên!");
      throw new HttpException("Token không hợp lệ", HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = jwtDecode(access_token);
      console.log("🔑 Token decoded:", decoded);
    } catch (error) {
      console.error("❌ Token không hợp lệ khi decode:", error);
      throw new HttpException("Token không hợp lệ", HttpStatus.UNAUTHORIZED);
    }

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

  async generateJwt(user: User) {
    const payload = { id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async syncWithTris(user: User) {
    try {
      const response = await axios.post(`${this.API_URL}/register`, {
        username: user.username,
        client_id: "oidcId",
      });

      console.log("✅ Đồng bộ thành công với TRIS:", response.data);

      // Lấy `id_sub` từ phản hồi
      const id_sub = response.data?.id_sub;
      if (!id_sub) {
        throw new HttpException(
          "Không nhận được id_sub từ OIDC!",
          HttpStatus.BAD_REQUEST
        );
      }
      await this.userService.updateIdSub(user.id, id_sub);

      return {
        success: true,
        message: "Đồng bộ thành công với TRIS!",
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Lỗi đồng bộ với TRIS:", error.response?.data || error);
      throw new HttpException(
        "Lỗi đồng bộ tài khoản, vui lòng thử lại.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
