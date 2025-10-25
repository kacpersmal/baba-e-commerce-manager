import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '@shared/config';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);

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
      this.logger.log('Redis connected successfully');
    });

    this.on('error', (error) => {
      this.logger.error('Redis connection error', error.stack);
    });

    this.on('ready', () => {
      this.logger.log('Redis is ready to accept commands');
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from Redis');
    await this.quit();
  }
}
