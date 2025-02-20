import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  id_sub?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @Expose()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  @MinLength(1)
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Expose()
  @Matches(/^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/, {
    message: "Số điện thoại không hợp lệ. Phải theo định dạng Việt Nam.",
  })
  sdt?: string;
}
