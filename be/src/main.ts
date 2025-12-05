import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      })
  )
    app.enableCors({
        credentials:true,
        origin:'http://localhost:5173'
    }) //radi, ali nisan siguran kolko je sigurna praksa

    app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
