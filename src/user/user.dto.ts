import { IsString, IsNotEmpty } from '@nestjs/class-validator';
import { MinLength } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class UpdateUserDto {
  name?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
