import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { ValidationPipe } from '@nestjs/common';
// LoggerMiddleware import removed as it will be configured in AppModule

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.DEVELOPMENT_FRONTEND_URL
        : process.env.PRODUCTION_FRONTEND_URL,
    credentials: true,
  });

  // Logger middleware removed from here

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
