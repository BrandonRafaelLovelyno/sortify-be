import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/common/token';
import { Cookie } from 'src/common/cookie';

@Module({
  controllers: [RewardController],
  providers: [RewardService, PrismaService, UserService, Token, Cookie],
})
export class RewardModule {}
