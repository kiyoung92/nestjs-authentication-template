import { InternalServerErrorException } from '@nestjs/common';
import { AuthRedisSetRefreshTokenParams } from 'src/auth/interfaces/auth-redis.interface';
import { IID } from 'src/global/dtos.global';
import { logger } from 'src/global/logger.global';
import { redis } from 'src/global/redis.global';

export const redisSetRefreshToken = async ({
  id,
  token,
  expiresIn,
}: AuthRedisSetRefreshTokenParams): Promise<string> => {
  try {
    logger.redis(`${id} ► Refresh Token Update`);
    return await redis.set(id, token, 'EX', expiresIn);
  } catch (error) {
    throw new InternalServerErrorException();
  }
};

export const redisGetRefreshToken = async ({
  id,
}: IID): Promise<string | null> => {
  try {
    return await redis.get(id);
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
