import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserDto {
  @ApiProperty({ description: "ID người dùng" })
  @Expose()
  id: number;

  @ApiProperty({ description: "ID OpenID Connect (OIDC) của người dùng" })
  @Expose()
  id_sub: string;

  @ApiProperty({ description: "Tên đầy đủ của người dùng" })
  @Expose()
  name: string;

  @ApiProperty({ description: "Tên đăng nhập" })
  @Expose()
  username: string;

  @ApiProperty({ description: "Email của người dùng" })
  @Expose()
  email: string;

  @ApiProperty({ description: "Số điện thoại" })
  @Expose()
  sdt: string;
}
