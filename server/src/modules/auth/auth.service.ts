import { User } from "./../user/entity/user.entity";
import { jwtDecode } from "jwt-decode";
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  Logger,
} from "@nestjs/common";
import axios from "axios";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import moment, { Moment } from "moment-timezone";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { OIDCTokenResDto } from "./dto/OIDCAdminAPITokenRes.dto";
import { OIDCService } from "./oidc.service";

@Injectable()
export class AuthService {
  private readonly OIDC_TOKEN_URL = "https://id2.tris.vn/connect/token";
  private readonly OIDC_USERINFO_URL = "https://id2.tris.vn/connect/userinfo";
  private readonly API_URL = "https://id2.tris.vn";
  private clientId: string;
  private clientSecret: string;

  private oidcUrl: string;
  private oidcAdminAPIUrl: string;
  private token: string;
  private tokenIssueAt: Moment;
  private tokenExpiredInSecond: number;
  private tokenType: string;
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly oidcService: OIDCService,
    @Inject(Logger) private readonly logger: Logger,

    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
    this.oidcUrl = configService.get("OIDC_URL");
    this.oidcAdminAPIUrl = configService.get("OIDC_ADMIN_API_URL");
    this.clientId = configService.get("OIDC_CLIENT_ID");
    this.clientSecret = configService.get("OIDC_CLIENT_SECRET");
  }

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
      const body = {
        username: user.username,
        email: user.email,
        password: user.password,
        id: undefined,
        emailConfirmed: true,
        phoneNumber: undefined,
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        twoFactorEnabled: false,
        accessFailedCount: 0,
        lockoutEnd: undefined,
      };

      await this.checkAndReloadToken(this.oidcUrl);
      const url = `${this.oidcAdminAPIUrl}/api/Users`;
      console.log(url);
      console.log(9);
      const res = await lastValueFrom(
        this.httpService.post(url, body, {
          headers: {
            Authorization: `${this.tokenType} ${this.token}`,
          },
        })
      );
      console.log(2);
      console.log("✅ Đồng bộ thành công với TRIS:", res.data);

      const id_sub = res.data?.id_sub;
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
        data: res.data,
      };
    } catch (error) {
      console.error("❌ Lỗi đồng bộ với TRIS:", error.response?.data || error);
      throw new HttpException(
        "Lỗi đồng bộ tài khoản, vui lòng thử lại.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private async checkAndReloadToken(iss: string) {
    console.log(1);
    if (!this.token || !this.tokenIssueAt) {
      await this.getToken(iss);
    } else {
      const now = moment();
      const diff = now.diff(this.tokenIssueAt, "seconds");
      if (diff > (3 / 4) * this.tokenExpiredInSecond) {
        await this.getToken(iss);
      }
    }
  }

  private async getToken(iss: string) {
    const config = await this.oidcService.loadOpenidConfiguration(iss);
    console.log(5);
    const tokenUrl = config.token_endpoint;

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    console.log(tokenUrl, body);
    const tokenRes = await lastValueFrom(
      this.httpService.post(tokenUrl, body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    );
    console.log(6);
    this.logger.debug(
      `getToken - get token from ${tokenUrl}, res: ${JSON.stringify(
        tokenRes.data
      )}`,
      AuthService.name
    );
    console.log(7);
    const tokenResData = tokenRes.data as OIDCTokenResDto;
    this.token = tokenResData.access_token;
    this.tokenExpiredInSecond = tokenResData.expires_in;
    this.tokenIssueAt = moment();
    this.tokenType = tokenResData.token_type;
  }
}
