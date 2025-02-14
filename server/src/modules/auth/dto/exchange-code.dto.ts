import { IsNotEmpty, IsString } from "class-validator";

export class ExchangeCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  redirect_uri: string;
}
