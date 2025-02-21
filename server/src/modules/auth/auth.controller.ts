import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";

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

  @Post("register")
  @ApiOperation({ summary: "Đăng ký tài khoản mới" })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.register(createUserDto);
    return {
      success: true,
      message: result.message,
      data: result.user,
    };
  }

  @Post("login")
  @ApiOperation({ summary: "Đăng nhập và nhận JWT" })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException("Sai thông tin đăng nhập");
    }
    return this.authService.generateJwt(user);
  }

  @Post("sync-to-tris")
  @ApiOperation({ summary: "Đồng bộ tài khoản lên TRIS (OIDC)" })
  async syncToTris(@Body() body: { username: string }) {
    if (!body.username) {
      throw new BadRequestException("Thiếu username trong request!");
    }
    const user = await this.userService.findByUsername(body.username);
    if (!user) {
      throw new NotFoundException("User không tồn tại trong hệ thống!");
    }
    return this.authService.syncWithTris(user);
  }
}
