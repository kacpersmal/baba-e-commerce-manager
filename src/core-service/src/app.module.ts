import { Module } from '@nestjs/common';
import { AppConfigModule } from '@shared/config';
import { PrismaModule } from '@shared/prisma';
import { RedisModule } from '@shared/redis';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, HealthModule, AuthModule],
})
export class AppModule {}
