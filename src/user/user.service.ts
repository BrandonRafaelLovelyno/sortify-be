import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from 'src/common/token';
import { AuthResult } from '../../types/auth';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: Token,
    private cloudinaryService: CloudinaryService,
  ) {}

  async findById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async getUserFromToken(token: string): Promise<AuthResult> {
    const userId = this.tokenService.verifyToken(token);
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    };
  }

  async updateUser(
    token: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const userId = this.tokenService.verifyToken(token);
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {};

    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      updateData.imageUrl = uploadResult.url;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      imageUrl: updatedUser.imageUrl,
    };
  }
}
