import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UserDto {
  @ApiProperty({
    example: 1,
    description: "Khóa chính của vai trò",
    required: true,
  })
  @Expose()
  @IsInt({ message: "ID phải là một số nguyên" })
  id: number;

  @ApiProperty({
    example: "admin",
    required: true,
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: "123456",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Expose()
  password: string;

  @ApiProperty({
    example: "admin@gmail.com",
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({
    example: "0123456789",
    required: true,
  })
  @IsString()
  @Expose()
  @IsOptional()
  sdt?: string;

  @IsOptional()
  @Expose()
  created_at: Date;

  @IsOptional()
  @Expose()
  updated_at: Date;
}
