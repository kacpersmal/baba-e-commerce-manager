import { Module } from '@nestjs/common';
import { AppConfigModule } from '@shared/config';
import { PrismaModule } from '@shared/prisma';
import { RedisModule } from '@shared/redis';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, HealthModule],
})
export class AppModule {}
