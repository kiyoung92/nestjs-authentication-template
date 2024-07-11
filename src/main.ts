import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { AppGlobal } from 'src/global/app.global';
import { CustomLogger } from 'src/global/logger.global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  await AppGlobal.beforeAll(app);
}
bootstrap();
