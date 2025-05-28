import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token } from '../common/token';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '../common/cookie';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class WasteService {
  FAST_API_URL: string;

  constructor(
    private prismaService: PrismaService,
    private tokenService: Token,
    private userService: UserService,
    private configService: ConfigService,
    private cookie: Cookie,
    private cloudinaryService: CloudinaryService,
  ) {
    const url = this.configService.get('FAST_API_URL');

    if (url) {
      this.FAST_API_URL = url;
    } else {
      throw new Error('FAST_API_URL is not defined in the configuration');
    }
  }
}
