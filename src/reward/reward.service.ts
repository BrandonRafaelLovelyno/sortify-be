import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RewardService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getUserRewards(token: string) {
    const user = await this.userService.getUserFromToken(token);

    const rewards = await this.prisma.reward.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return rewards;
  }
}
