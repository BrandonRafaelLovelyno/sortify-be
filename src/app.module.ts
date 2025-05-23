import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppMailerModule } from './mailer/mailer.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { WasteModule } from './waste/waste.module';
import { UserModule } from './user/user.module';
import { ClassificationModule } from './classification/classification.module';
import { RewardModule } from './reward/reward.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AppMailerModule,
    WasteModule,
    ClassificationModule,
    RewardModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
