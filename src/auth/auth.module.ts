import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppMailerModule } from '../mailer/mailer.module';
import { CommonModule } from '../common/common.module';
import { AuthHelper } from './auth.helper';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, AppMailerModule, CommonModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
})
export class AuthModule {}
