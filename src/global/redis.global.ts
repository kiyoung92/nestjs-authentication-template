import { Redis } from 'ioredis';
import { getEnv } from 'src/global/config.global';
import { logger } from 'src/global/logger.global';

export let redis: Redis;

export const connectRedis = () => {
  redis = new Redis({
    host: getEnv<string>('REDIS_HOST'),
    port: getEnv<number>('REDIS_PORT'),
  });

  redis
    .on('connect', () => {
      logger.redis('connected');
    })
    .on('error', (error) => {
      logger.error(`[REDIS] ► ${error}`);
    })
    .on('reconnecting', () => {
      logger.warn('[REDIS] ► reconnecting...');
    });
};
