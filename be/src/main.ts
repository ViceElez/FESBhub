import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';
import express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // povecanje limita na image al mozemo to i smanjit  u realnosti nije potrebno
    //limit na image inace je 1mb default
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    
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