import {
  Controller,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthResult } from '../../types/auth';
import { Request } from 'express';
import { Cookie } from 'src/common/cookie';
import { UpdatePasswordDto, UpdateUserDto } from './user.dto';

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

  @Patch('me')
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.userService.updateUser(token, updateUserDto, file);
  }

  @Patch('password/mine')
  async updatePassword(
    @Req() request: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const token = this.cookie.getCookie(request, 'auth_token');
    return await this.userService.updatePassword(token, updatePasswordDto);
  }
}
