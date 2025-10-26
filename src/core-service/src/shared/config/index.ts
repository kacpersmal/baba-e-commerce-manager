import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import authConfig from './auth.config';

export { appConfig, databaseConfig, redisConfig, authConfig };
export { AppConfigService } from './config.service';
export { AppConfigModule } from './config.module';
export type {
  AppConfig,
  DatabaseConfig,
  RedisConfig,
  AuthConfig,
} from './config.service';
