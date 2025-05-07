import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Token } from 'src/common/token';
import { AuthResult } from '../../types/auth';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private tokenService: Token,
  ) {}

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
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

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
