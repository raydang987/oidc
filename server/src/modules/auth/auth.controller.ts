import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("verify-token")
  @ApiOperation({ summary: "Xác thực token và lưu user vào DB" })
  async verifyToken(@Body() body: { access_token: string }) {
    console.log("📥 Body nhận được từ request:", body);

    if (!body.access_token) {
      throw new BadRequestException("Thiếu access_token trong request!");
    }
    return this.userService.findOrCreateUser(body.access_token);
  }
}
