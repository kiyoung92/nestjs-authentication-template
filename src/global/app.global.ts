import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { getEnv } from 'src/global/config.global';
import { AllExceptionsFilter } from 'src/global/excption-filter.global';
import { logger } from 'src/global/logger.global';
import { prisma } from 'src/global/prisma.global';
import { connectRedis } from 'src/global/redis.global';

export class AppGlobal {
  public static async beforeAll<T extends INestApplication>(
    app: T,
  ): Promise<void> {
    const swaggerConfig = readFileSync('./swagger.json', 'utf8');

    SwaggerModule.setup('api', app, JSON.parse(swaggerConfig));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.use(cookieParser());
    app.enableCors({
      origin: getEnv<string>('CLIENT_URL'),
      methods: 'GET,HEAD,POST,PATCH,DELETE',
      allowedHeaders: 'Content-type,Authorization',
      exposedHeaders: 'Authorization,Location',
      credentials: true,
    });
    app.setGlobalPrefix(getEnv<string>('API_VERSION'));

    connectRedis();
    await prisma.$connect();
    await app.listen(getEnv<number>('PORT'));

    logger.info(`Server is running on ${getEnv<number>('PORT')}`);
  }
}
