import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppMailerModule } from 'src/mailer/mailer.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [PrismaModule, AppMailerModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
