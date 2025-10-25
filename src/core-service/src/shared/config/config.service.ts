import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
}

export interface DatabaseConfig {
  url?: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  url?: string;
  host: string;
  port: number;
  password: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfig {
    return {
      nodeEnv: this.configService.get<string>('app.nodeEnv', 'development'),
      port: this.configService.get<number>('app.port', 8000),
      isDevelopment: this.configService.get<boolean>('app.isDevelopment', true),
      isProduction: this.configService.get<boolean>('app.isProduction', false),
    };
  }

  get database(): DatabaseConfig {
    return {
      url: this.configService.get<string>('database.url'),
      host: this.configService.get<string>('database.host', 'localhost'),
      port: this.configService.get<number>('database.port', 5432),
      username: this.configService.get<string>(
        'database.username',
        'local_dev',
      ),
      password: this.configService.get<string>(
        'database.password',
        'local_dev',
      ),
      database: this.configService.get<string>('database.database', 'baba_dev'),
    };
  }

  get redis(): RedisConfig {
    return {
      url: this.configService.get<string>('redis.url'),
      host: this.configService.get<string>('redis.host', 'localhost'),
      port: this.configService.get<number>('redis.port', 6379),
      password: this.configService.get<string>('redis.password', 'local_dev'),
    };
  }
}
