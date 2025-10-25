import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '@shared/config';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: AppConfigService) {
    const redisConfig = configService.redis;

    super({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      showFriendlyErrorStack: true,
    });
  }

  async onModuleInit() {
    this.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.on('ready', () => {
      console.log('Redis is ready to accept commands');
    });
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
