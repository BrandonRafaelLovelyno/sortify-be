import { IsString, IsNotEmpty } from '@nestjs/class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
