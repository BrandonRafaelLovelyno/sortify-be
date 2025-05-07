import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppMailerModule } from './mailer/mailer.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AppMailerModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
