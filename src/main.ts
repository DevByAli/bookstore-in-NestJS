import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  app.setBaseViewsDir(join(__dirname, '../src/templates'));
  app.setViewEngine('ejs');

  const port = process.env.APP_SERVER_PORT || 3000;
  await app.listen(port, ()=>console.log("Server listening on PORT", port));
}

bootstrap();
