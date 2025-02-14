import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ExchangeCodeDto } from "./dto/exchange-code.dto";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("oidc")
  @ApiOperation({ summary: "Xác thực token" })
  @ApiOkResponse({ type: ExchangeCodeDto })
  async exchangeCodeForToken(@Body() exchangeCodeDto: ExchangeCodeDto) {
    const { code, redirect_uri } = exchangeCodeDto;

    if (!code || !redirect_uri) {
      throw new BadRequestException(
        "Mã xác thực hoặc redirect_uri không hợp lệ"
      );
    }

    return this.authService.exchangeCodeForToken(code, redirect_uri);
  }
}
