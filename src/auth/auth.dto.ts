import { IsEmail, IsString, MinLength } from '@nestjs/class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  hashedPassword: string;

  @IsString()
  @MinLength(6)
  name: string;
}

export class VerifyUserDto {
  @IsString()
  @MinLength(10)
  token: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
