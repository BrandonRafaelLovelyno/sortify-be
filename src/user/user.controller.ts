import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthResult } from '../../types/auth';
import { Request } from 'express';
import { Cookie } from 'src/common/cookie';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cookie: Cookie,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getUserFromToken(@Req() request: Request): Promise<AuthResult> {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.userService.getUserFromToken(token);
  }
}
