import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { RedisModule } from '@/shared/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
