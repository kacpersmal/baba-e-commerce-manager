import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@shared/config';
import { PrismaModule } from '@shared/prisma';
import { RedisModule } from '@shared/redis';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
