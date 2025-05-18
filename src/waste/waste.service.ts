import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from 'src/common/token';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import axios from 'axios';
import { Cookie } from 'src/common/cookie';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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

  async classifyWaste(
    file: Express.Multer.File,
    request: any,
  ): Promise<{ classificationId: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const token = this.cookie.getCookie(request, 'auth_token');
    const userId = this.tokenService.verifyToken(token);

    const { url } = await this.cloudinaryService.uploadImage(file);

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(`${this.FAST_API_URL}`, formData);
      const { prediction } = response.data;

      const wasteCategory = await this.prismaService.wasteCategory.findFirst({
        where: {
          name: {
            contains: prediction,
            mode: 'insensitive',
          },
        },
      });

      if (!wasteCategory) {
        throw new BadRequestException('Invalid waste category prediction');
      }

      const waste = await this.prismaService.waste.create({
        data: {
          userId,
          image: url,
          date: new Date(),
        },
      });

      const classification = await this.prismaService.classification.create({
        data: {
          wasteId: waste.id,
          wasteCategoryId: wasteCategory.id,
        },
      });

      const result = { classificationId: classification.id };
      return result;
    } catch (error) {
      console.log('Error classifying waste image:', error);
      throw new BadRequestException('Failed to classify waste image');
    }
  }
}
