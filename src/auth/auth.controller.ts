import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    await this.authService.signUp(body);
    return { message: 'Verification email sent successfully' };
  }
}
