import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
export const getEnv = <T>(key: string): T => {
  const env = configService.get<T>(key);

  if (!env) {
    throw new InternalServerErrorException(
      `환경변수 ${key}(이)가 존재하지 않습니다.`,
    );
  }

  return env;
};
