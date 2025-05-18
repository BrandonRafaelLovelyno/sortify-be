import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from 'src/common/token';
import { AuthResult } from '../../types/auth';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordDto, UpdateUserDto } from './user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: Token,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getUserPoints(userId: string): Promise<number> {
    const rewards = await this.prismaService.reward.findMany({
      where: { userId },
      select: { points: true },
    });
    return rewards.reduce((total, reward) => total + reward.points, 0);
  }

  async findById(id: string) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async getUserFromToken(token: string): Promise<AuthResult> {
    const userId = this.tokenService.verifyToken(token);
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const points = await this.getUserPoints(userId);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      points,
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

  async updatePassword(token: string, updatePasswordDto: UpdatePasswordDto) {
    const userId = this.tokenService.verifyToken(token);
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.hashedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}
