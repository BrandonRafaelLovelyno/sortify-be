import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppMailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AppMailerModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
