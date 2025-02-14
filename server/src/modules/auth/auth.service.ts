import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async exchangeCodeForToken(code: string, redirectUri: string) {
    const clientId = this.configService.get<string>("OIDC_CLIENT_ID"); // "oidcId"
    const tokenUrl = "https://id2.tris.vn/token";

    const payload = {
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
    };

    try {
      const response = await this.httpService.axiosRef.post(tokenUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data; // Trả về access token cho frontend
    } catch (error) {
      throw new Error("Lỗi trao đổi mã lấy token: " + error.message);
    }
  }
}
