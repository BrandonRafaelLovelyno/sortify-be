import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: [process.env.NEXT_CLIENT_URL, process.env.NEXT_SERVER_URL],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.init();
  return app;
}

bootstrap().then(() => {
  expressApp.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
});

export { bootstrap };
