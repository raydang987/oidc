import { IsOptional, IsString, ValidateIf } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Match } from "./match.decorator";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_sub?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.password)
  @Match(UpdateUserDto, (s) => s.password, {
    message: `confirmPassword doesn't match with password`,
  })
  confirmPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sdt?: string;
}
