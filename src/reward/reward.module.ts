import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Token } from '../common/token';
import { Cookie } from '../common/cookie';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CloudinaryModule, PrismaModule, UserModule],
  controllers: [RewardController],
  providers: [RewardService, PrismaService, UserService, Token, Cookie],
})
export class RewardModule {}
