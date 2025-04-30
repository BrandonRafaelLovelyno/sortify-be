import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { VerifyUserDto } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return { message: 'Verification email sent successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-user')
  async verifyUser(@Body() body: VerifyUserDto) {
    const user = await this.authService.verifyUser(body);
    return { message: 'User verified successfully', user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: SignInDto, @Res() response: Response) {
    const user = await this.authService.login(body, response);
    response.status(HttpStatus.OK).json({ message: 'Login successful', user });
  }

}
